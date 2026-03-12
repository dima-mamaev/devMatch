import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { spawn } from 'child_process';
import { basename, resolve } from 'path';
import { stat, unlink } from 'fs/promises';
import type { Queue } from 'bullmq';
import { ConvertVideoInputData, ConvertVideoOutputData } from '../../../types/types';

interface VideoInfo {
  codec: string;
  container: string;
  width: number;
  height: number;
  bitrate: number;
  duration: number;
  fileSize: number;
}

const TARGET_MAX_BITRATE = 1_000_000;
const TARGET_MAX_WIDTH = 1280;
const TARGET_CRF = 30;
const ALREADY_OPTIMIZED_THRESHOLD = 0.8;

@Injectable()
export class VideoConverterService {
  constructor(
    @InjectQueue('ConverterOutputQueue')
    private readonly queue: Queue,
    @InjectQueue('ConverterDeadLetterQueue')
    private readonly deadLetterQueue: Queue,
  ) { }

  async probeVideo(inputPath: string): Promise<VideoInfo> {
    return new Promise((resolve, reject) => {
      const ffprobeArgs = [
        '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=codec_name,width,height,bit_rate,duration',
        '-show_entries', 'format=format_name,size,duration,bit_rate',
        '-of', 'json',
        inputPath,
      ];

      let stdout = '';
      let stderr = '';
      const ffprobe = spawn('ffprobe', ffprobeArgs);

      ffprobe.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      ffprobe.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      ffprobe.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`ffprobe failed: ${stderr}`));
          return;
        }

        try {
          const data = JSON.parse(stdout);
          const stream = data.streams?.[0] || {};
          const format = data.format || {};

          resolve({
            codec: stream.codec_name || 'unknown',
            container: format.format_name || 'unknown',
            width: parseInt(stream.width) || 0,
            height: parseInt(stream.height) || 0,
            bitrate: parseInt(stream.bit_rate || format.bit_rate) || 0,
            duration: parseFloat(stream.duration || format.duration) || 0,
            fileSize: parseInt(format.size) || 0,
          });
        } catch (err) {
          reject(new Error(`Failed to parse ffprobe output: ${err}`));
        }
      });
    });
  }

  private isMp4Container(container: string): boolean {
    return container.includes('mp4') || container.includes('mov');
  }

  shouldConvert(info: VideoInfo): { shouldConvert: boolean; reason: string; mustConvert: boolean } {
    if (!this.isMp4Container(info.container)) {
      return { shouldConvert: true, mustConvert: true, reason: `Non-MP4 container: ${info.container}` };
    }

    if (info.codec !== 'h264') {
      return { shouldConvert: true, mustConvert: true, reason: `Non-H.264 codec: ${info.codec}` };
    }

    if (info.width > TARGET_MAX_WIDTH) {
      return { shouldConvert: true, mustConvert: false, reason: `Resolution too high: ${info.width}x${info.height}` };
    }

    if (info.bitrate > TARGET_MAX_BITRATE) {
      return { shouldConvert: true, mustConvert: false, reason: `Bitrate too high: ${Math.round(info.bitrate / 1000)}kbps` };
    }

    const expectedSize = (TARGET_MAX_BITRATE / 8) * info.duration;
    const currentSize = info.fileSize;

    if (currentSize <= expectedSize * ALREADY_OPTIMIZED_THRESHOLD) {
      return { shouldConvert: false, mustConvert: false, reason: `Already optimized: ${Math.round(currentSize / 1024)}KB` };
    }

    return { shouldConvert: true, mustConvert: false, reason: 'General optimization needed' };
  }

  async convert(inputPath: string): Promise<string> {
    const inputFileName = basename(inputPath, '.mp4');
    const outputPath = resolve(`tmp_files/${inputFileName}_converted.mp4`);

    let info: VideoInfo;
    try {
      info = await this.probeVideo(inputPath);
    } catch (err) {
      info = { codec: 'unknown', container: 'unknown', width: 0, height: 0, bitrate: 0, duration: 0, fileSize: 0 };
    }
    const { shouldConvert, mustConvert, reason } = this.shouldConvert(info);

    if (!shouldConvert) {
      return inputPath;
    }

    const ffmpegArgs = ['-i', inputPath];

    if (info.width > TARGET_MAX_WIDTH) {
      ffmpegArgs.push('-vf', `scale=${TARGET_MAX_WIDTH}:-2`);
    }

    ffmpegArgs.push(
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', String(TARGET_CRF),
      '-maxrate', '1M',
      '-bufsize', '2M',
      '-c:a', 'aac',
      '-b:a', '96k',
      '-movflags', '+faststart',
      '-y',
      outputPath,
    );

    return new Promise((resolve, reject) => {
      let processClosed = false;
      let stderrOutput = '';

      const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

      ffmpegProcess.stderr?.on('data', (data: Buffer) => {
        stderrOutput += data.toString();
      });

      ffmpegProcess.on('error', (err) => {
        if (processClosed) return;
        processClosed = true;
        reject(err);
      });

      ffmpegProcess.on('close', async (code) => {
        if (processClosed) return;
        processClosed = true;

        if (code === 0) {
          try {
            const outputStats = await stat(outputPath);
            const inputSize = info.fileSize || 0;
            const outputSize = outputStats.size;
            const savings = inputSize > 0
              ? Math.round((1 - outputSize / inputSize) * 100)
              : 0;

            if (!mustConvert && inputSize > 0 && outputSize >= inputSize) {
              await unlink(outputPath).catch(() => { });
              resolve(inputPath);
              return;
            }
          } catch {
          }
          resolve(outputPath);
        } else {
          const err = new Error(`Video converting failed with code: ${code}`);
          reject(err);
        }
      });
    });
  }

  async enqueueConvertedVideoOutput(data: ConvertVideoOutputData) {
    return this.queue.add('ConvertVideoOutput', data);
  }

  async enqueueConvertedVideoFailed(data: ConvertVideoOutputData) {
    return this.queue.add('ConvertVideoFailed', data);
  }

  async enqueueToDeadLetter(data: ConvertVideoInputData, errorMessage: string): Promise<void> {
    await this.deadLetterQueue.add('DeadLetterJob', {
      ...data,
      errorMessage,
      failedAt: new Date().toISOString(),
    });
  }
}
