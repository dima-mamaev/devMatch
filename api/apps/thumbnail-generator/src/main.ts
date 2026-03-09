import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThumbnailGeneratorModule } from './thumbnail-generator.module';

async function bootstrap() {
  const configModule = await NestFactory.createApplicationContext(ConfigModule);
  const config = configModule.get(ConfigService);

  const app = await NestFactory.createMicroservice(ThumbnailGeneratorModule, {
    transport: Transport.REDIS,
    options: {
      host: config.get<string>('REDIS_HOST'),
      port: config.get<number>('REDIS_PORT'),
    },
  });
  await app.listen();
}
void bootstrap();
