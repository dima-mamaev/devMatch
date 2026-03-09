import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { spawn } from 'child_process';
import { basename, resolve } from 'path';
import { stat, unlink } from 'fs/promises';
import type { Queue } from 'bullmq';
import { ConvertVideoOutputData } from '../../../types/types';

interface VideoInfo {
  codec: string;
  container: string;
  width: number;
  height: number;
  bitrate: number;
  duration: number;
  fileSize: number;
}

// Target settings for optimization
const TARGET_MAX_BITRATE = 1_000_000; // 1 Mbps
const TARGET_MAX_WIDTH = 1280; // 720p max
const TARGET_CRF = 30; // More aggressive compression
const ALREADY_OPTIMIZED_THRESHOLD = 0.8; // Skip if input is within 80% of target

@Injectable()
export class VideoConverterService {
  constructor(
    @InjectQueue('ConverterOutputQueue')
    private readonly queue: Queue,
  ) {}

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
            container: format.format_name || 'unknown', // e.g., "mov,mp4,m4a,3gp,3g2,mj2" for MP4
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
    // FFprobe returns "mov,mp4,m4a,3gp,3g2,mj2" for MP4 files
    return container.includes('mp4') || container.includes('mov');
  }

  shouldConvert(info: VideoInfo): { shouldConvert: boolean; reason: string; mustConvert: boolean } {
    // Always convert non-MP4 containers (mustConvert = true means we can't use original even if larger)
    if (!this.isMp4Container(info.container)) {
      return { shouldConvert: true, mustConvert: true, reason: `Non-MP4 container: ${info.container}` };
    }

    // Always convert non-H.264 videos
    if (info.codec !== 'h264') {
      return { shouldConvert: true, mustConvert: true, reason: `Non-H.264 codec: ${info.codec}` };
    }

    // Convert if resolution is too high
    if (info.width > TARGET_MAX_WIDTH) {
      return { shouldConvert: true, mustConvert: false, reason: `Resolution too high: ${info.width}x${info.height}` };
    }

    // Convert if bitrate is too high
    if (info.bitrate > TARGET_MAX_BITRATE) {
      return { shouldConvert: true, mustConvert: false, reason: `Bitrate too high: ${Math.round(info.bitrate / 1000)}kbps` };
    }

    // Calculate expected optimized size based on target bitrate
    const expectedSize = (TARGET_MAX_BITRATE / 8) * info.duration;
    const currentSize = info.fileSize;

    // Skip if already smaller than what we'd produce
    if (currentSize <= expectedSize * ALREADY_OPTIMIZED_THRESHOLD) {
      return { shouldConvert: false, mustConvert: false, reason: `Already optimized: ${Math.round(currentSize / 1024)}KB` };
    }

    return { shouldConvert: true, mustConvert: false, reason: 'General optimization needed' };
  }

  async convert(inputPath: string): Promise<string> {
    const inputFileName = basename(inputPath, '.mp4');
    const outputPath = resolve(`tmp_files/${inputFileName}_converted.mp4`);

    console.log('[FFmpeg] Input:', inputPath);

    // Probe input video first
    let info: VideoInfo;
    try {
      info = await this.probeVideo(inputPath);
      console.log('[FFmpeg] Input info:', {
        codec: info.codec,
        container: info.container,
        resolution: `${info.width}x${info.height}`,
        bitrate: `${Math.round(info.bitrate / 1000)}kbps`,
        duration: `${info.duration.toFixed(1)}s`,
        size: `${Math.round(info.fileSize / 1024)}KB`,
      });
    } catch (err) {
      console.warn('[FFmpeg] Probe failed, proceeding with conversion:', err);
      info = { codec: 'unknown', container: 'unknown', width: 0, height: 0, bitrate: 0, duration: 0, fileSize: 0 };
    }

    // Check if conversion is needed
    const { shouldConvert, mustConvert, reason } = this.shouldConvert(info);
    console.log(`[FFmpeg] Should convert: ${shouldConvert}, must convert: ${mustConvert} (${reason})`);

    if (!shouldConvert) {
      console.log('[FFmpeg] Skipping conversion, input is already optimized');
      return inputPath; // Return original file path
    }

    console.log('[FFmpeg] Output:', outputPath);

    // Build FFmpeg args based on input analysis
    const ffmpegArgs = ['-i', inputPath];

    // Scale down if resolution is too high
    if (info.width > TARGET_MAX_WIDTH) {
      ffmpegArgs.push('-vf', `scale=${TARGET_MAX_WIDTH}:-2`);
    }

    ffmpegArgs.push(
      '-c:v', 'libx264',
      '-preset', 'slow',        // Better compression (was 'fast')
      '-crf', String(TARGET_CRF), // More aggressive compression (was '23')
      '-maxrate', '1M',         // Cap bitrate
      '-bufsize', '2M',         // Buffer size for rate control
      '-c:a', 'aac',
      '-b:a', '96k',            // Lower audio bitrate (was '128k')
      '-movflags', '+faststart',
      '-y',
      outputPath,
    );

    console.log('[FFmpeg] Running:', 'ffmpeg', ffmpegArgs.join(' '));

    return new Promise((resolve, reject) => {
      let processClosed = false;
      let stderrOutput = '';

      const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

      ffmpegProcess.stderr?.on('data', (data: Buffer) => {
        stderrOutput += data.toString();
      });

      ffmpegProcess.on('error', (err) => {
        console.error(`FFmpeg process failed: ${err.message}`);
        if (processClosed) return;
        processClosed = true;
        reject(err);
      });

      ffmpegProcess.on('close', async (code) => {
        if (processClosed) return;
        processClosed = true;

        if (code === 0) {
          // Compare sizes and use the smaller file
          try {
            const outputStats = await stat(outputPath);
            const inputSize = info.fileSize || 0;
            const outputSize = outputStats.size;
            const savings = inputSize > 0
              ? Math.round((1 - outputSize / inputSize) * 100)
              : 0;

            console.log(`[FFmpeg] Conversion complete: ${outputPath}`);
            console.log(`[FFmpeg] Size: ${Math.round(inputSize / 1024)}KB → ${Math.round(outputSize / 1024)}KB (${savings}% ${savings >= 0 ? 'smaller' : 'larger'})`);

            // If converted file is larger and we don't MUST convert, use the original instead
            // mustConvert is true when input is not H.264/MP4, so we must use converted version
            if (!mustConvert && inputSize > 0 && outputSize >= inputSize) {
              console.log('[FFmpeg] Converted file is larger, using original instead');
              await unlink(outputPath).catch(() => {});
              resolve(inputPath);
              return;
            }
          } catch {
            console.log(`[FFmpeg] Conversion complete: ${outputPath}`);
          }
          resolve(outputPath);
        } else {
          const err = new Error(`Video converting failed with code: ${code}`);
          console.error(`ffmpeg stderr:\n${stderrOutput}`);
          reject(err);
        }
      });
    });
  }

  async enqueueConvertedVideoOutput(data: ConvertVideoOutputData) {
    return this.queue.add('ConvertVideoOutput', data);
  }
}
