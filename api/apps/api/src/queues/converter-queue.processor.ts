import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { MediaService } from '../media/media.service';
import { GeneratorQueueService } from './generator-queue.service';
import { ConvertVideoOutputData } from '../../../../types/types';

@Processor('ConverterOutputQueue')
export class ConverterQueueProcessor extends WorkerHost {
  constructor(
    private readonly mediaService: MediaService,
    private readonly generatorQueueService: GeneratorQueueService,
  ) {
    super();
  }

  process({ name, data }: Job<ConvertVideoOutputData>) {
    switch (name) {
      case 'ConvertVideoOutput':
        return this.saveVideo(data);
      default:
        throw new Error(`Unknown job name: ${name}`);
    }
  }

  async saveVideo(data: ConvertVideoOutputData) {
    const updatedMedia = await this.mediaService.updateUrl(
      data.videoMediaId,
      data.outputPath,
    );

    if (data.developerId) {
      await this.generatorQueueService.enqueueGenerateThumbnail({
        videoPath: data.outputPath,
        developerId: data.developerId,
        videoMediaId: data.videoMediaId,
      });
    }

    return updatedMedia;
  }
}
