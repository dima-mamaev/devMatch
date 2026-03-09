import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ThumbnailGeneratorService } from './thumbnail-generator.service';
import { configSchema } from './config.schema';
import { ThumbnailGeneratorProcessor } from './thumbnail-generator.processor';
import { CloudinaryService } from './cloudinary.service';
import { BullConfigService } from './bull-config.service';

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
      name: 'GeneratorInputQueue',
    }),
    BullModule.registerQueue({
      name: 'GeneratorOutputQueue',
    }),
  ],
  providers: [CloudinaryService, ThumbnailGeneratorService, ThumbnailGeneratorProcessor],
})
export class ThumbnailGeneratorModule {}
