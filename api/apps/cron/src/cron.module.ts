import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThreadCleanupJob } from './jobs/thread-cleanup.job.js';
import { SessionExpiryJob } from './jobs/session-expiry.job.js';
import { OpenAICleanupService } from './services/openai-cleanup.service.js';
import { RedisCleanupService } from './services/redis-cleanup.service.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot()],
  providers: [
    ThreadCleanupJob,
    SessionExpiryJob,
    OpenAICleanupService,
    RedisCleanupService,
  ],
})
export class CronModule { }
