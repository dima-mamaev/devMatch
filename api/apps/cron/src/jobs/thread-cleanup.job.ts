import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OpenAICleanupService } from '../services/openai-cleanup.service.js';

@Injectable()
export class ThreadCleanupJob {
  private readonly logger = new Logger(ThreadCleanupJob.name);

  constructor(private readonly openaiCleanup: OpenAICleanupService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron() {
    this.logger.log('Starting orphaned thread cleanup...');

    try {
      const result = await this.openaiCleanup.cleanupOrphanedThreads();
      this.logger.log(`Cleanup complete: ${result.deleted} threads deleted`);
    } catch (error) {
      this.logger.error('Thread cleanup failed:', error);
    }
  }
}
