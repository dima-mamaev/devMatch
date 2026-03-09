import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { MediaService } from '../media/media.service';
import { MediaType } from '../shared/enums/media-type.enum';
import { MediaProcessingStatus } from '../shared/enums/media-processing-status.enum';
import { DeveloperService } from '../developer/developer.service';
import { GenerateThumbnailOutputData } from '../../../../types/types';

@Processor('GeneratorOutputQueue')
export class GeneratorQueueProcessor extends WorkerHost {
  constructor(
    private readonly mediaService: MediaService,
    private readonly developerService: DeveloperService,
  ) {
    super();
  }

  process({ name, data }: Job<GenerateThumbnailOutputData>) {
    switch (name) {
      case 'GenerateThumbnailOutput':
        return this.saveThumbnail(data);
      default:
        throw new Error(`Unknown job name: ${name}`);
    }
  }

  async saveThumbnail(data: GenerateThumbnailOutputData) {
    // Create media record for the generated thumbnail
    const [createdMedia] = await this.mediaService.create([
      { url: data.path, type: MediaType.Image },
    ]);

    // Link the thumbnail to the developer's intro video
    if (data.developerId) {
      const developer = await this.developerService.findById(data.developerId);
      if (developer) {
        await this.developerService.updateIntroVideo(
          data.developerId,
          developer.introVideo?.id ?? null,
          createdMedia.id,
        );

        // Mark video processing as complete
        if (data.videoMediaId) {
          await this.mediaService.updateProcessingStatus(
            data.videoMediaId,
            MediaProcessingStatus.Ready,
          );
        }
      }
    }

    return createdMedia;
  }
}
