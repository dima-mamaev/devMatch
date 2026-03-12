import { Controller, Post, Body, Logger } from '@nestjs/common';
import { OpenAIAgentService } from './openai/openai-agent.service.js';
import { EventPublisherService } from './events/event-publisher.service.js';

interface MatchingRequest {
  sessionId: string;
  messageId: string;
  prompt: string;
  threadId?: string;
  excludeIds?: string[];
  maxResults?: number;
}

interface CancelRequest {
  sessionId: string;
  threadId: string;
  runId: string;
}

@Controller()
export class AIAgentController {
  private readonly logger = new Logger(AIAgentController.name);

  constructor(
    private readonly openaiService: OpenAIAgentService,
    private readonly eventPublisher: EventPublisherService,
  ) { }

  @Post('api/match')
  async runMatchingAgent(@Body() request: MatchingRequest) {
    this.logger.log(`Starting match for session: ${request.sessionId}`);

    const threadId = await this.openaiService.getOrCreateThread(
      request.threadId,
    );

    this.openaiService
      .runMatchingAgentStreaming(
        request.sessionId,
        request.messageId,
        request.prompt,
        threadId,
        request.excludeIds,
        request.maxResults,
      )
      .catch((error) => {
        this.logger.error(`Match processing failed: ${error.message}`);
        this.eventPublisher.publishError(
          request.sessionId,
          request.messageId,
          error.message,
        );
      });

    return {
      success: true,
      threadId,
      message: 'Processing started',
    };
  }

  @Post('api/cancel')
  async cancelRun(@Body() request: CancelRequest) {
    const success = await this.openaiService.cancelRun(
      request.threadId,
      request.runId,
      request.sessionId,
    );
    return {
      success,
      message: success ? 'Run cancelled' : 'Failed to cancel',
    };
  }

}
