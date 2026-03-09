import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { resolve } from 'path';
import { readFile, unlink, writeFile, mkdir } from 'fs/promises';
import { VideoConverterService } from './video-converter.service';
import { ConvertVideoInputData } from '../../../types/types';
import { CloudinaryService } from './cloudinary.service';

@Processor('ConverterInputQueue', { concurrency: 2 })
export class VideoConverterProcessor extends WorkerHost {
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
    // Download video from Cloudinary to temp file
    const tempDir = resolve('tmp_files');
    await mkdir(tempDir, { recursive: true });

    const timestamp = Date.now();
    const inputFileName = `input_${developerId}_${timestamp}.mp4`;
    const outputFileName = `input_${developerId}_${timestamp}_converted.mp4`;
    const tempInputPath = resolve(tempDir, inputFileName);
    const tempOutputPath = resolve(tempDir, outputFileName);

    try {
      // Download the video
      console.log('[VideoConverter] Downloading video from:', inputPath);
      const videoBuffer = await this.cloudinaryService.getFileBuffer(inputPath);
      console.log('[VideoConverter] Downloaded buffer size:', videoBuffer.length);
      await writeFile(tempInputPath, videoBuffer);
      console.log('[VideoConverter] Saved to temp:', tempInputPath);

      // Convert the video (may return original path if already optimized)
      console.log('[VideoConverter] Starting conversion...');
      const convertedPath = await this.videoConverterService.convert(tempInputPath);
      const wasConverted = convertedPath !== tempInputPath;
      console.log('[VideoConverter] Result:', wasConverted ? 'Converted' : 'Skipped (already optimized)');

      // Upload video (converted or original)
      const fileBuffer = await readFile(convertedPath);
      console.log('[VideoConverter] File size to upload:', fileBuffer.length);

      const publicId = `${developerId}_${timestamp}`;
      const outputUrl = await this.cloudinaryService.uploadFile(
        publicId,
        fileBuffer,
        'video',
        'devmatch/videos',
      );
      console.log('[VideoConverter] Uploaded to Cloudinary:', outputUrl);

      // Clean up local temp files
      await unlink(tempInputPath);
      if (wasConverted) {
        await unlink(convertedPath);
      }

      // Delete original temp file from Cloudinary
      const tempPublicId = this.cloudinaryService.extractPublicId(inputPath);
      if (tempPublicId) {
        await this.cloudinaryService.deleteVideo(tempPublicId);
        console.log('[VideoConverter] Deleted temp file from Cloudinary:', tempPublicId);
      }

      // Queue output
      return this.videoConverterService.enqueueConvertedVideoOutput({
        outputPath: outputUrl,
        developerId,
        videoMediaId,
      });
    } catch (err) {
      // Clean up on error
      try {
        await unlink(tempInputPath);
      } catch {
        // Ignore cleanup errors
      }
      try {
        await unlink(tempOutputPath);
      } catch {
        // Ignore cleanup errors
      }
      console.error('[VideoConverter] Error:', err);
      throw err;
    }
  }
}
