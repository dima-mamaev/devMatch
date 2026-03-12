import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { AIMatchEvent, AIMatchEventType } from '../../../../../libs/shared/src/types/event.types.js';
import { SessionService } from '../session/session.service.js';

interface PendingMatch {
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
    experiences?: Array<{ companyName: string; position: string; yearsWorked: number }>;
    projects?: Array<{ name: string; techStack: string[] }>;
  };
}

interface PendingMatchEntry {
  matches: PendingMatch[];
  createdAt: number;
}

const PENDING_MATCH_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class PubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PubSubService.name);
  private pubsub: RedisPubSub;
  private redisSubscriber: Redis;
  private pendingMatches = new Map<string, PendingMatchEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

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
            this.pendingMatches.set(key, { matches: [], createdAt: Date.now() });
          }
          const match = event.data.match;
          const dev = match.developer;
          this.pendingMatches.get(key)?.matches.push({
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
              experiences: dev.experiences || [],
              projects: dev.projects || [],
            } : undefined,
          });
        }

        if (event.type === AIMatchEventType.COMPLETE) {
          const key = `${sessionId}:${event.messageId}`;
          const entry = this.pendingMatches.get(key);
          const matches = entry?.matches || [];
          this.pendingMatches.delete(key);

          await this.sessionService.addMessageToHistory(sessionId, {
            id: event.messageId,
            role: 'assistant',
            content: event.data?.summary || '',
            timestamp: event.timestamp,
            matches,
          });
        }

        if (event.type === AIMatchEventType.ERROR || event.type === AIMatchEventType.CANCELLED) {
          const key = `${sessionId}:${event.messageId}`;
          this.pendingMatches.delete(key);
        }

        await this.pubsub.publish(`ai-match:${sessionId}`, { aiMatchEvents: event });
        this.logger.debug(`Relayed ${event.type} event for session ${sessionId}`);
      } catch (error) {
        this.logger.error(`Failed to relay event from ${channel}:`, error);
      }
    });

    this.cleanupInterval = setInterval(() => this.cleanupStalePendingMatches(), CLEANUP_INTERVAL_MS);

    this.logger.log('Redis event bridge initialized for AI Agent events');
  }

  async publish(sessionId: string, event: AIMatchEvent): Promise<void> {
    await this.pubsub.publish(`ai-match:${sessionId}`, { aiMatchEvents: event });
  }

  subscribe(sessionId: string): AsyncIterator<AIMatchEvent> {
    return this.pubsub.asyncIterator(`ai-match:${sessionId}`);
  }

  async onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    await this.redisSubscriber.punsubscribe('ai-agent-events:*');
    await this.redisSubscriber.quit();
    await this.pubsub.close();
  }

  private cleanupStalePendingMatches(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.pendingMatches.entries()) {
      if (now - entry.createdAt > PENDING_MATCH_TTL_MS) {
        this.pendingMatches.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} stale pending match entries`);
    }
  }
}
