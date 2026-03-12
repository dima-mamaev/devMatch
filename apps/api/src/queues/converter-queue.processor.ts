import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { MediaService } from '../media/media.service';
import { MediaProcessingStatus } from '../shared/enums/media-processing-status.enum';
import { ConvertVideoOutputData } from '../../../../types/types';

@Processor('ConverterOutputQueue')
export class ConverterQueueProcessor extends WorkerHost {
  constructor(private readonly mediaService: MediaService) {
    super();
  }

  async process({ name, data }: Job<ConvertVideoOutputData>) {
    switch (name) {
      case 'ConvertVideoOutput':
        return this.saveVideo(data);
      case 'ConvertVideoFailed':
        return this.handleConversionFailed(data);
      default:
        throw new Error(`Unknown job name: ${name}`);
    }
  }

  async saveVideo(data: ConvertVideoOutputData) {
    await this.mediaService.updateUrl(data.videoMediaId, data.outputPath);
    await this.mediaService.updateProcessingStatus(
      data.videoMediaId,
      MediaProcessingStatus.Ready,
    );
  }

  async handleConversionFailed(data: ConvertVideoOutputData) {
    await this.mediaService.updateProcessingStatus(
      data.videoMediaId,
      MediaProcessingStatus.Failed,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<ConvertVideoOutputData>) {
    this.mediaService
      .updateProcessingStatus(job.data.videoMediaId, MediaProcessingStatus.Failed)
      .catch(() => {});
  }
}
