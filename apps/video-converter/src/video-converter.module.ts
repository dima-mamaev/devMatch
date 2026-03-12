import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { configSchema } from './config.schema';
import { VideoConverterProcessor } from './video-converter.processor';
import { VideoConverterService } from './video-converter.service';
import { CloudinaryService } from './cloudinary.service';
import { BullConfigService } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      validationSchema: configSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useClass: BullConfigService,
    }),
    BullModule.registerQueue({
      name: 'ConverterInputQueue',
    }),
    BullModule.registerQueue({
      name: 'ConverterOutputQueue',
    }),
    BullModule.registerQueue({
      name: 'ConverterDeadLetterQueue',
    }),
  ],
  providers: [CloudinaryService, VideoConverterService, VideoConverterProcessor],
})
export class VideoConverterModule {}
