import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisCleanupService } from '../services/redis-cleanup.service.js';

@Injectable()
export class SessionExpiryJob {
  private readonly logger = new Logger(SessionExpiryJob.name);

  constructor(private readonly redisCleanup: RedisCleanupService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Checking for stale sessions...');

    try {
      const sessionResult = await this.redisCleanup.expireStaleSessions();
      const queueResult = await this.redisCleanup.cleanupMessageQueues();

      this.logger.log(
        `Session cleanup: ${sessionResult.expired} sessions expired, ${queueResult.cleaned} queues cleaned`,
      );
    } catch (error) {
      this.logger.error('Session expiry failed:', error);
    }
  }
}
