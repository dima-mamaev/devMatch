import { BullModule } from '@nestjs/bullmq';
import { Module, forwardRef } from '@nestjs/common';
import { GeneratorQueueProcessor } from './generator-queue.processor';
import { ConverterQueueProcessor } from './converter-queue.processor';
import { ConverterQueueService } from './converter-queue.service';
import { GeneratorQueueService } from './generator-queue.service';
import { DeveloperModule } from '../developer/developer.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'ConverterInputQueue',
    }),
    BullModule.registerQueue({
      name: 'ConverterOutputQueue',
    }),
    BullModule.registerQueue({
      name: 'GeneratorInputQueue',
    }),
    BullModule.registerQueue({
      name: 'GeneratorOutputQueue',
    }),
    forwardRef(() => DeveloperModule),
    forwardRef(() => MediaModule),
  ],
  providers: [
    ConverterQueueProcessor,
    GeneratorQueueProcessor,
    ConverterQueueService,
    GeneratorQueueService,
  ],
  exports: [ConverterQueueService, GeneratorQueueService],
})
export class QueuesModule {}
