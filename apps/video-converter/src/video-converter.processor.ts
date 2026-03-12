import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { resolve } from 'path';
import { readFile, unlink, writeFile, mkdir } from 'fs/promises';
import { VideoConverterService } from './video-converter.service';
import { Logger } from '@nestjs/common';
import { ConvertVideoInputData } from '../../../types/types';
import { CloudinaryService } from './cloudinary.service';

@Processor('ConverterInputQueue', { concurrency: 2 })
export class VideoConverterProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoConverterProcessor.name);

  constructor(
    private readonly videoConverterService: VideoConverterService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    super();
  }

  process({ name, data }: Job<ConvertVideoInputData>) {
    switch (name) {
      case 'ConvertVideoInput':
        return this.convertVideo(data);
      default:
        throw new Error(`Unknown job name: ${name}`);
    }
  }

  async convertVideo({ inputPath, developerId, videoMediaId }: ConvertVideoInputData) {
    const tempDir = resolve('tmp_files');
    await mkdir(tempDir, { recursive: true });

    const timestamp = Date.now();
    const inputFileName = `input_${developerId}_${timestamp}.mp4`;
    const outputFileName = `input_${developerId}_${timestamp}_converted.mp4`;
    const tempInputPath = resolve(tempDir, inputFileName);
    const tempOutputPath = resolve(tempDir, outputFileName);

    try {
      const videoBuffer = await this.cloudinaryService.getFileBuffer(inputPath);
      await writeFile(tempInputPath, videoBuffer);
      const convertedPath = await this.videoConverterService.convert(tempInputPath);
      const wasConverted = convertedPath !== tempInputPath;
      const fileBuffer = await readFile(convertedPath);

      const publicId = `${developerId}_${timestamp}`;
      const outputUrl = await this.cloudinaryService.uploadFile(
        publicId,
        fileBuffer,
        'video',
        'devmatch/videos',
      );
      await unlink(tempInputPath);
      if (wasConverted) {
        await unlink(convertedPath);
      }

      const tempPublicId = this.cloudinaryService.extractPublicId(inputPath);
      if (tempPublicId) {
        await this.cloudinaryService.deleteVideo(tempPublicId);
      }

      return this.videoConverterService.enqueueConvertedVideoOutput({
        outputPath: outputUrl,
        developerId,
        videoMediaId,
      });
    } catch (err) {
      try {
        await unlink(tempInputPath);
      } catch {
      }
      try {
        await unlink(tempOutputPath);
      } catch {
      }

      await this.videoConverterService.enqueueConvertedVideoFailed({
        outputPath: '',
        developerId,
        videoMediaId,
      });
    }
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<ConvertVideoInputData>, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);

    if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
      await this.videoConverterService.enqueueToDeadLetter(job.data, error.message);
    }
  }
}
