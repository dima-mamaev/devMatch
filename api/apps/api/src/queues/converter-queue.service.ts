import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { ConvertVideoInputData } from '../../../../types/types';

@Injectable()
export class ConverterQueueService {
  constructor(
    @InjectQueue('ConverterInputQueue')
    private readonly queue: Queue,
  ) {}

  async enqueueConvertVideo(data: ConvertVideoInputData) {
    return this.queue.add('ConvertVideoInput', data);
  }
}
