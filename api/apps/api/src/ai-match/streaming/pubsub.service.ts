import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { AIMatchEvent, AIMatchEventType } from '../../../../../libs/shared/src/types/event.types.js';
import { SessionService } from '../session/session.service.js';

@Injectable()
export class PubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PubSubService.name);
  private pubsub: RedisPubSub;
  private redisSubscriber: Redis;
  private pendingMatches = new Map<string, Array<{
    developerId: string;
    matchScore: number;
    matchReason: string;
    developer?: {
      id: string;
      firstName: string;
      lastName: string;
      jobTitle?: string;
      bio?: string;
      techStack: string[];
      seniorityLevel?: string;
      location?: string;
      availabilityStatus?: string;
      profilePhotoUrl?: string;
    };
  }>>();

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => SessionService))
    private sessionService: SessionService,
  ) {
    const redisOptions = {
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    };

    this.pubsub = new RedisPubSub({
      publisher: new Redis(redisOptions),
      subscriber: new Redis(redisOptions),
    });

    this.redisSubscriber = new Redis(redisOptions);
  }

  async onModuleInit() {
    await this.redisSubscriber.psubscribe('ai-agent-events:*');

    this.redisSubscriber.on('pmessage', async (_pattern, channel, message) => {
      try {
        const event = JSON.parse(message) as AIMatchEvent;
        const sessionId = channel.replace('ai-agent-events:', '');

        if (event.type === AIMatchEventType.MATCH_FOUND && event.data?.match) {
          const key = `${sessionId}:${event.messageId}`;
          if (!this.pendingMatches.has(key)) {
            this.pendingMatches.set(key, []);
          }
          const match = event.data.match;
          const dev = match.developer;
          this.pendingMatches.get(key)?.push({
            developerId: match.developerId,
            matchScore: match.matchScore,
            matchReason: match.matchReason,
            developer: dev ? {
              id: dev.id,
              firstName: dev.firstName,
              lastName: dev.lastName,
              jobTitle: dev.jobTitle,
              bio: dev.bio,
              techStack: dev.techStack || [],
              seniorityLevel: dev.seniorityLevel,
              location: dev.location,
              availabilityStatus: dev.availabilityStatus,
              profilePhotoUrl: dev.profilePhotoUrl,
            } : undefined,
          });
        }

        if (event.type === AIMatchEventType.COMPLETE) {
          const key = `${sessionId}:${event.messageId}`;
          const matches = this.pendingMatches.get(key) || [];
          this.pendingMatches.delete(key);

          await this.sessionService.addMessageToHistory(sessionId, {
            id: event.messageId,
            role: 'assistant',
            content: event.data?.summary || '',
            timestamp: event.timestamp,
            matches,
          });
        }

        await this.pubsub.publish(`ai-match:${sessionId}`, { aiMatchEvents: event });
        this.logger.debug(`Relayed ${event.type} event for session ${sessionId}`);
      } catch (error) {
        this.logger.error(`Failed to relay event from ${channel}:`, error);
      }
    });

    this.logger.log('Redis event bridge initialized for AI Agent events');
  }

  async publish(sessionId: string, event: AIMatchEvent): Promise<void> {
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
