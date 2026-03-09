import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { GenerateThumbnailInputData } from '../../../types/types';
import { ThumbnailGeneratorService } from './thumbnail-generator.service';
import { CloudinaryService } from './cloudinary.service';

@Processor('GeneratorInputQueue', { concurrency: 1 })
export class ThumbnailGeneratorProcessor extends WorkerHost {
  constructor(
    private readonly thumbnailGeneratorService: ThumbnailGeneratorService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    super();
  }

  process({ name, data }: Job<GenerateThumbnailInputData>) {
    switch (name) {
      case 'GenerateThumbnailInput':
        return this.generateThumbnail(data);
      default:
        throw new Error(`Unknown job name: ${name}`);
    }
  }

  async generateThumbnail(data: GenerateThumbnailInputData) {
    const { videoPath, developerId, videoMediaId } = data;
    console.log('[Thumbnail] Starting thumbnail generation');
    console.log('[Thumbnail] Input:', { videoPath, developerId, videoMediaId });

    try {
      // Generate thumbnail from video using puppeteer
      console.log('[Thumbnail] Launching Puppeteer...');
      const buffer = await this.thumbnailGeneratorService.generateThumbnailFromVideo(videoPath);
      console.log('[Thumbnail] Screenshot captured, buffer size:', buffer.length);

      // Upload thumbnail to Cloudinary
      const publicId = `${developerId}_${Date.now()}`;
      console.log('[Thumbnail] Uploading to Cloudinary, publicId:', publicId);
      const url = await this.cloudinaryService.uploadFile(publicId, buffer);
      console.log('[Thumbnail] Uploaded successfully:', url);

      // Queue output for processing in main API
      console.log('[Thumbnail] Queuing output for main API...');
      await this.thumbnailGeneratorService.enqueueGenerateThumbnailOutput({
        path: url,
        developerId,
        videoMediaId,
      });
      console.log('[Thumbnail] Done! Output queued.');
    } catch (err) {
      console.error('[Thumbnail] Error generating thumbnail:', err);
      throw err;
    }
  }
}
