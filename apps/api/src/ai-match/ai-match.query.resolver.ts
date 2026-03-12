import { Resolver, Query, Subscription, Args, Context } from '@nestjs/graphql';
import { RateLimitService } from './rate-limit/rate-limit.service.js';
import { MessageQueueService } from './queue/message-queue.service.js';
import { PubSubService } from './streaming/pubsub.service.js';
import {
  AIMatchEvent,
  AIMatchRateLimitInfo,
  AIMatchQueueStatus,
} from './models/ai-match.model.js';
import { ActiveUser } from '../shared/decorators/active-user.decorator.js';
import { User } from '../user/models/user.entity.js';
import { SkipSystemGuard } from '../shared/decorators/skip-system-guard.decorator.js';
import { getUserInfo } from './utils/user-info.util.js';

@Resolver()
export class AIMatchQueryResolver {
  constructor(
    private rateLimitService: RateLimitService,
    private messageQueueService: MessageQueueService,
    private pubsubService: PubSubService,
  ) { }

  @SkipSystemGuard()
  @Query(() => AIMatchRateLimitInfo)
  async aiMatchRateLimitInfo(
    @ActiveUser() user: User | null,
    @Context() ctx: { req?: { ip?: string; headers?: Record<string, string> } },
  ): Promise<AIMatchRateLimitInfo> {
    const { userType, identifier } = getUserInfo(user, ctx);
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
}
