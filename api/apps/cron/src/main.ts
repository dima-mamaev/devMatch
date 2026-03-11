import { NestFactory } from '@nestjs/core';
import { CronModule } from './cron.module.js';

async function bootstrap() {
  const app = await NestFactory.create(CronModule);
  await app.init();
}

bootstrap();
