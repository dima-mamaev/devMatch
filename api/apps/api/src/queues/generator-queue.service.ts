import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { GenerateThumbnailInputData } from '../../../../types/types';

@Injectable()
export class GeneratorQueueService {
  constructor(
    @InjectQueue('GeneratorInputQueue')
    private readonly queue: Queue,
  ) {}

  async enqueueGenerateThumbnail(data: GenerateThumbnailInputData) {
    return this.queue.add('GenerateThumbnailInput', data);
  }
}
