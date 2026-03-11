import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import {
  AIMatchEvent,
  AIMatchEventType,
  createEvent,
} from '../../../../libs/shared/src/types/event.types.js';

@Injectable()
export class EventPublisherService implements OnModuleDestroy {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async publish(sessionId: string, event: AIMatchEvent): Promise<void> {
    // Use distinct channel prefix to avoid collision with main API's RedisPubSub
    await this.redis.publish(`ai-agent-events:${sessionId}`, JSON.stringify(event));
  }

  async publishRunStarted(sessionId: string, runId: string): Promise<void> {
    // Store run ID for cancellation lookup (expires in 1 hour)
    await this.redis.set(`ai-match:run:${sessionId}`, runId, 'EX', 3600);
  }

  async publishError(
    sessionId: string,
    messageId: string,
    errorMessage: string,
  ): Promise<void> {
    await this.publish(
      sessionId,
      createEvent(AIMatchEventType.ERROR, sessionId, messageId, {
        errorMessage,
      }),
    );
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
