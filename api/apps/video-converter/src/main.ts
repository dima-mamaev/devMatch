import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { VideoConverterModule } from './video-converter.module';

async function bootstrap() {
  const configModule = await NestFactory.createApplicationContext(ConfigModule);
  const config = configModule.get(ConfigService);

  const app = await NestFactory.createMicroservice(VideoConverterModule, {
    transport: Transport.REDIS,
    options: {
      host: config.get<string>('REDIS_HOST'),
      port: config.get<number>('REDIS_PORT'),
    },
  });
  await app.listen();
}
void bootstrap();
