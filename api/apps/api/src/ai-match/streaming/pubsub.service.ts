import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { AIMatchEvent } from '../../../../../libs/shared/src/types/event.types.js';

@Injectable()
export class PubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PubSubService.name);
  private pubsub: RedisPubSub;
  private redisSubscriber: Redis;

  constructor(private configService: ConfigService) {
    const redisOptions = {
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    };

    this.pubsub = new RedisPubSub({
      publisher: new Redis(redisOptions),
      subscriber: new Redis(redisOptions),
    });

    // Separate Redis subscriber to bridge AI Agent events
    this.redisSubscriber = new Redis(redisOptions);
  }

  async onModuleInit() {
    // Listen for AI Agent events via pattern subscription (distinct channel prefix)
    await this.redisSubscriber.psubscribe('ai-agent-events:*');

    this.redisSubscriber.on('pmessage', async (_pattern, channel, message) => {
      try {
        const event = JSON.parse(message) as AIMatchEvent;
        // Extract sessionId from channel (ai-agent-events:sessionId -> sessionId)
        const sessionId = channel.replace('ai-agent-events:', '');
        // Relay to GraphQL subscriptions using the correct channel name
        await this.pubsub.publish(`ai-match:${sessionId}`, { aiMatchEvents: event });
        this.logger.debug(`Relayed ${event.type} event for session ${sessionId}`);
      } catch (error) {
        this.logger.error(`Failed to relay event from ${channel}:`, error);
      }
    });

    this.logger.log('Redis event bridge initialized for AI Agent events');
  }

  async publish(sessionId: string, event: AIMatchEvent): Promise<void> {
    // Publish directly to GraphQL PubSub (no Redis, avoids duplicate)
    await this.pubsub.publish(`ai-match:${sessionId}`, { aiMatchEvents: event });
  }

  subscribe(sessionId: string): AsyncIterator<AIMatchEvent> {
    return this.pubsub.asyncIterator(`ai-match:${sessionId}`);
  }

  async onModuleDestroy() {
    await this.redisSubscriber.punsubscribe('ai-agent-events:*');
    await this.redisSubscriber.quit();
    await this.pubsub.close();
  }
}
