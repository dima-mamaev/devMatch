import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { AIMatchService } from './ai-match.service.js';
import { RateLimitService } from './rate-limit/rate-limit.service.js';
import { SessionService } from './session/session.service.js';
import { MessageQueueService } from './queue/message-queue.service.js';
import {
  AIMatchStartSessionInput,
  AIMatchSendInput,
  AIMatchCancelInput,
} from './inputs/ai-match.input.js';
import { AIMatchSession } from './models/ai-match.model.js';
import { ActiveUser } from '../shared/decorators/active-user.decorator.js';
import { User } from '../user/models/user.entity.js';
import { UserType } from './rate-limit/rate-limit.types.js';
import { SkipSystemGuard } from '../shared/decorators/skip-system-guard.decorator.js';

@Resolver()
export class AIMatchMutationResolver {
  constructor(
    private aiMatchService: AIMatchService,
    private rateLimitService: RateLimitService,
    private sessionService: SessionService,
    private messageQueueService: MessageQueueService,
  ) { }

  @SkipSystemGuard()
  @Mutation(() => AIMatchSession)
  async aiMatchStartSession(
    @Args('input', { type: () => AIMatchStartSessionInput, nullable: true })
    input: AIMatchStartSessionInput | null,
    @ActiveUser() user: User | null,
    @Context() ctx: { req?: { ip?: string; headers?: Record<string, string> } },
  ): Promise<AIMatchSession> {
    const { userType } = this.getUserInfo(user, ctx);
    const userId = user?.id || null;

    const session = await this.sessionService.getOrCreateSession(
      input?.sessionId || null,
      userId,
    );

    return {
      sessionId: session.sessionId,
      userType,
      conversationHistory: session.conversationHistory || [],
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

    if (userType === 'guest') {
      await this.sessionService.setThreadId(input.sessionId, null);
    }

    await this.sessionService.addMessageToHistory(input.sessionId, {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.prompt,
      timestamp: new Date().toISOString(),
    });

    await this.messageQueueService.enqueueMessage(input.sessionId, input.prompt);

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

    return {
      userType: 'authenticated',
      identifier: user.id,
    };
  }
}
