import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import Redis from 'ioredis';

@Injectable()
export class OpenAICleanupService implements OnModuleDestroy {
  private readonly logger = new Logger(OpenAICleanupService.name);
  private openai: OpenAI;
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async cleanupOrphanedThreads(): Promise<{ deleted: number }> {
    let deleted = 0;

    try {
      const threadKeys = await this.redis.keys('ai-match:thread:*');

      for (const key of threadKeys) {
        const threadData = await this.redis.get(key);
        if (!threadData) continue;

        const { threadId, createdAt } = JSON.parse(threadData);
        const age = Date.now() - new Date(createdAt).getTime();
        const maxAge = 24 * 60 * 60 * 1000;

        if (age > maxAge) {
          try {
            await this.openai.beta.threads.delete(threadId);
            await this.redis.del(key);
            deleted++;
            this.logger.debug(`Deleted orphaned thread: ${threadId}`);
          } catch (error) {
            this.logger.warn(`Failed to delete thread ${threadId}:`, error);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error during thread cleanup:', error);
      throw error;
    }

    return { deleted };
  }

  async trackThread(sessionId: string, threadId: string): Promise<void> {
    await this.redis.set(
      `ai-match:thread:${sessionId}`,
      JSON.stringify({
        threadId,
        createdAt: new Date().toISOString(),
      }),
      'EX',
      86400,
    );
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
