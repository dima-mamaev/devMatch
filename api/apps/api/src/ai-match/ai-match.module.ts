import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AIMatchService } from './ai-match.service.js';
import { AIMatchResolver } from './ai-match.resolver.js';
import { AIAgentClient } from './http/ai-agent.client.js';
import { RateLimitService } from './rate-limit/rate-limit.service.js';
import { PubSubService } from './streaming/pubsub.service.js';
import { SessionService } from './session/session.service.js';
import { MessageQueueService } from './queue/message-queue.service.js';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 3,
    }),
    ConfigModule,
  ],
  providers: [
    AIMatchService,
    AIMatchResolver,
    AIAgentClient,
    RateLimitService,
    PubSubService,
    SessionService,
    MessageQueueService,
  ],
  exports: [AIMatchService],
})
export class AIMatchModule {}
