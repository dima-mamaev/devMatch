import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisCleanupService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisCleanupService.name);
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async expireStaleSessions(): Promise<{ expired: number }> {
    let expired = 0;

    try {
      const sessionKeys = await this.redis.keys('ai-match:session:*');

      for (const key of sessionKeys) {
        const sessionData = await this.redis.get(key);
        if (!sessionData) continue;

        try {
          const session = JSON.parse(sessionData);
          const lastActivity = new Date(session.lastActivity || session.createdAt);
          const age = Date.now() - lastActivity.getTime();
          const maxAge = 2 * 60 * 60 * 1000;

          if (age > maxAge) {
            await this.redis.del(key);
            expired++;
            this.logger.debug(`Expired stale session: ${key}`);
          }
        } catch {
          await this.redis.del(key);
          expired++;
        }
      }

      const rateLimitKeys = await this.redis.keys('ai-match:rate-limit:*');
      for (const key of rateLimitKeys) {
        const ttl = await this.redis.ttl(key);
        if (ttl === -1) {
          await this.redis.del(key);
          this.logger.debug(`Cleaned up rate limit key without TTL: ${key}`);
        }
      }
    } catch (error) {
      this.logger.error('Error during session cleanup:', error);
      throw error;
    }

    return { expired };
  }

  async cleanupMessageQueues(): Promise<{ cleaned: number }> {
    let cleaned = 0;

    try {
      const queueKeys = await this.redis.keys('ai-match:queue:*');

      for (const key of queueKeys) {
        const queueData = await this.redis.get(key);
        if (!queueData) continue;

        try {
          const queue = JSON.parse(queueData);
          const lastUpdate = new Date(queue.updatedAt || queue.createdAt);
          const age = Date.now() - lastUpdate.getTime();
          const maxAge = 1 * 60 * 60 * 1000;

          if (age > maxAge) {
            await this.redis.del(key);
            cleaned++;
            this.logger.debug(`Cleaned stale queue: ${key}`);
          }
        } catch {
          await this.redis.del(key);
          cleaned++;
        }
      }
    } catch (error) {
      this.logger.error('Error during queue cleanup:', error);
      throw error;
    }

    return { cleaned };
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
