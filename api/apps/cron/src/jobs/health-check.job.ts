import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import Redis from 'ioredis';

@Injectable()
export class HealthCheckJob implements OnModuleDestroy {
  private readonly logger = new Logger(HealthCheckJob.name);
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

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    const status = {
      openai: await this.checkOpenAI(),
      redis: await this.checkRedis(),
      timestamp: new Date().toISOString(),
    };

    if (!status.openai || !status.redis) {
      this.logger.error('Health check failed:', status);
    } else {
      this.logger.debug('Health check passed');
    }

    // Store status in Redis for monitoring
    await this.redis.set(
      'ai-match:health-status',
      JSON.stringify(status),
      'EX',
      600, // 10 minutes TTL
    );
  }

  private async checkOpenAI(): Promise<boolean> {
    try {
      await this.openai.models.list();
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
