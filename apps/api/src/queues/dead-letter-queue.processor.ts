import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import type { UUID } from 'crypto';
import { MediaService } from '../media/media.service';
import { MediaProcessingStatus } from '../shared/enums/media-processing-status.enum';

interface DeadLetterJobData {
  inputPath: string;
  developerId: UUID;
  videoMediaId: UUID;
  errorMessage: string;
  failedAt: string;
}

@Processor('ConverterDeadLetterQueue')
export class DeadLetterQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(DeadLetterQueueProcessor.name);

  constructor(private readonly mediaService: MediaService) {
    super();
  }

  async process(job: Job<DeadLetterJobData>) {
    this.logger.error(`Dead letter job: ${JSON.stringify(job.data)}`);

    await this.mediaService.updateProcessingStatus(
      job.data.videoMediaId,
      MediaProcessingStatus.Failed,
    );
  }
}
