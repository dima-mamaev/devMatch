import {
  Resolver,
  Mutation,
  Query,
  Subscription,
  Args,
  Context,
} from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { AIMatchService } from './ai-match.service.js';
import { RateLimitService } from './rate-limit/rate-limit.service.js';
import { SessionService } from './session/session.service.js';
import { MessageQueueService } from './queue/message-queue.service.js';
import { PubSubService } from './streaming/pubsub.service.js';
import { AIMatchSendInput, AIMatchCancelInput } from './inputs/ai-match.input.js';
import {
  AIMatchEvent,
  AIMatchRateLimitInfo,
  AIMatchQueueStatus,
  AIMatchSession,
} from './models/ai-match.model.js';
import { ActiveUser } from '../shared/decorators/active-user.decorator.js';
import { User } from '../user/models/user.entity.js';
import { UserType } from './rate-limit/rate-limit.types.js';
import { UserRole } from '../shared/enums/user-role.enum.js';
import { SkipSystemGuard } from '../shared/decorators/skip-system-guard.decorator.js';

@Resolver()
export class AIMatchResolver {
  constructor(
    private aiMatchService: AIMatchService,
    private rateLimitService: RateLimitService,
    private sessionService: SessionService,
    private messageQueueService: MessageQueueService,
    private pubsubService: PubSubService,
  ) {}

  // ==================== MUTATIONS ====================

  @SkipSystemGuard()
  @Mutation(() => AIMatchSession)
  async aiMatchStartSession(
    @ActiveUser() user: User | null,
    @Context() ctx: { req?: { ip?: string; headers?: Record<string, string> } },
  ): Promise<AIMatchSession> {
    const { userType } = this.getUserInfo(user, ctx);
    const userId = user?.id || null;

    const session = await this.sessionService.getOrCreateSession(null, userId);

    return {
      sessionId: session.sessionId,
      userType,
      maxResults: this.rateLimitService.getMaxResults(userType),
    };
  }

  @SkipSystemGuard()
  @Mutation(() => Boolean)
  async aiMatchSendMessage(
    @Args('input') input: AIMatchSendInput,
    @ActiveUser() user: User | null,
    @Context() ctx: { req?: { ip?: string; headers?: Record<string, string> } },
  ): Promise<boolean> {
    const { userType, identifier } = this.getUserInfo(user, ctx);

    // Check rate limit
    const { allowed, info } = await this.rateLimitService.checkAndIncrement(
      identifier,
      userType,
    );

    if (!allowed) {
      throw new ForbiddenException(
        `Rate limit exceeded. You have used all ${info.limit} searches for today. ` +
          `Limit resets at ${info.resetsAt}.`,
      );
    }

    // Guests can't use threads (conversation continuity)
    if (userType === 'guest') {
      await this.sessionService.setThreadId(input.sessionId, null);
    }

    // Enqueue the message
    await this.messageQueueService.enqueueMessage(input.sessionId, input.prompt);

    // Trigger processing (async - returns immediately)
    this.aiMatchService.processQueue(input.sessionId).catch((err) => {
      console.error('Queue processing error:', err);
    });

    return true;
  }

  @SkipSystemGuard()
  @Mutation(() => Boolean)
  async aiMatchCancel(
    @Args('input') input: AIMatchCancelInput,
  ): Promise<boolean> {
    switch (input.target) {
      case 'current':
        return this.aiMatchService.cancelCurrentRun(input.sessionId);
      case 'queued':
        if (!input.messageId) {
          throw new Error('messageId required for cancelling queued message');
        }
        return this.messageQueueService.cancelMessage(
          input.sessionId,
          input.messageId,
        );
      case 'all': {
        await this.aiMatchService.cancelCurrentRun(input.sessionId);
        const status = await this.messageQueueService.getQueueStatus(
          input.sessionId,
        );
        for (const msg of status.queued) {
          await this.messageQueueService.cancelMessage(
            input.sessionId,
            msg.messageId,
          );
        }
        return true;
      }
      default:
        return false;
    }
  }

  // ==================== QUERIES ====================

  @SkipSystemGuard()
  @Query(() => AIMatchRateLimitInfo)
  async aiMatchRateLimitInfo(
    @ActiveUser() user: User | null,
    @Context() ctx: { req?: { ip?: string; headers?: Record<string, string> } },
  ): Promise<AIMatchRateLimitInfo> {
    const { userType, identifier } = this.getUserInfo(user, ctx);
    return this.rateLimitService.getRateLimitInfo(identifier, userType);
  }

  @SkipSystemGuard()
  @Query(() => AIMatchQueueStatus)
  async aiMatchQueueStatus(
    @Args('sessionId') sessionId: string,
  ): Promise<AIMatchQueueStatus> {
    const status = await this.messageQueueService.getQueueStatus(sessionId);
    return {
      processing: status.processing || undefined,
      queued: status.queued,
    };
  }

  // ==================== SUBSCRIPTIONS ====================

  @Subscription(() => AIMatchEvent, {
    filter: (
      payload: { aiMatchEvents: AIMatchEvent },
      variables: { sessionId: string },
    ) => {
      return payload.aiMatchEvents.sessionId === variables.sessionId;
    },
    resolve: (payload: { aiMatchEvents: AIMatchEvent }) => payload.aiMatchEvents,
  })
  aiMatchEvents(@Args('sessionId') sessionId: string) {
    return this.pubsubService.subscribe(sessionId);
  }

  // ==================== HELPERS ====================

  private getUserInfo(
    user: User | null,
    ctx: { req?: { ip?: string; headers?: Record<string, string> } },
  ): { userType: UserType; identifier: string } {
    if (!user) {
      const ip =
        ctx.req?.ip || ctx.req?.headers?.['x-forwarded-for'] || 'unknown';
      const fingerprint = ctx.req?.headers?.['x-fingerprint'] || '';
      return {
        userType: 'guest',
        identifier: `${ip}:${fingerprint}`,
      };
    }

    const isPaidRecruiter = user.role === UserRole.Recruiter;
    return {
      userType: isPaidRecruiter ? 'recruiter' : 'authenticated',
      identifier: user.id,
    };
  }
}
