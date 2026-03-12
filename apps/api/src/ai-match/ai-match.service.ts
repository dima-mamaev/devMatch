import { Injectable, Logger } from '@nestjs/common';
import { AIAgentClient } from './http/ai-agent.client.js';
import { MessageQueueService } from './queue/message-queue.service.js';
import { SessionService } from './session/session.service.js';
import { PubSubService } from './streaming/pubsub.service.js';
import { AIMatchEventType, createEvent } from '../../../../libs/shared/src/types/event.types.js';

@Injectable()
export class AIMatchService {
  private readonly logger = new Logger(AIMatchService.name);
  private activeProcessors = new Set<string>();

  constructor(
    private aiAgentClient: AIAgentClient,
    private messageQueueService: MessageQueueService,
    private sessionService: SessionService,
    private pubsubService: PubSubService,
  ) {}

  async processQueue(sessionId: string): Promise<void> {
    if (this.activeProcessors.has(sessionId)) {
      this.logger.debug(`Session ${sessionId}: processor already active, skipping`);
      return; // Another processor is already running
    }

    this.activeProcessors.add(sessionId);
    this.logger.log(`Session ${sessionId}: starting queue processor`);

    try {
      let processedCount = 0;
      while (true) {
        const nextMessage =
          await this.messageQueueService.getNextMessage(sessionId);
        if (!nextMessage) {
          break; // Queue is empty
        }

        this.logger.log(
          `Session ${sessionId}: processing message ${nextMessage.messageId}`,
        );

        await this.processMessage(
          sessionId,
          nextMessage.messageId,
          nextMessage.prompt,
        );
        processedCount++;
      }

      this.logger.log(
        `Session ${sessionId}: queue processor finished, processed ${processedCount} messages`,
      );
    } finally {
      this.activeProcessors.delete(sessionId);
    }
  }

  private async processMessage(
    sessionId: string,
    messageId: string,
    prompt: string,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      await this.messageQueueService.markMessageStarted(sessionId, messageId);
      this.logger.log(`Message ${messageId}: marked as started`);

      const session = await this.sessionService.getSession(sessionId);

      this.logger.log(
        `Message ${messageId}: calling AI Agent service, threadId=${session?.threadId || 'new'}`,
      );

      const response = await this.aiAgentClient.runMatchingAgent({
        sessionId,
        messageId,
        prompt,
        threadId: session?.threadId || undefined,
        maxResults: 10,
      });

      if (response.threadId && response.threadId !== session?.threadId) {
        await this.sessionService.setThreadId(sessionId, response.threadId);
        this.logger.log(`Message ${messageId}: threadId updated to ${response.threadId}`);
      }

      await this.messageQueueService.markMessageCompleted(sessionId, messageId);

      const duration = Date.now() - startTime;
      this.logger.log(`Message ${messageId}: completed in ${duration}ms`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Message ${messageId}: failed after ${duration}ms - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      await this.messageQueueService.markMessageFailed(sessionId, messageId);
      await this.pubsubService.publish(
        sessionId,
        createEvent(AIMatchEventType.ERROR, sessionId, messageId, {
          errorMessage:
            error instanceof Error ? error.message : 'Processing failed',
        }),
      );
    }
  }

  async cancelCurrentRun(sessionId: string): Promise<boolean> {
    this.logger.log(`Cancel requested for session ${sessionId}`);

    const session = await this.sessionService.getSession(sessionId);
    if (!session) {
      this.logger.warn(`Session ${sessionId} not found for cancel`);
      return false;
    }

    const activeMessage = session.messageQueue?.find(
      (m) => m.status === 'processing' || m.status === 'queued',
    );

    this.logger.log(
      `Session ${sessionId}: threadId=${session.threadId}, activeMessage=${activeMessage?.messageId}, status=${activeMessage?.status}`,
    );

    if (session.threadId) {
      const runId = await this.sessionService.getCurrentRunId(sessionId);
      this.logger.log(`Session ${sessionId}: runId=${runId}`);

      if (runId) {
        try {
          await this.aiAgentClient.cancelRun({
            sessionId,
            threadId: session.threadId,
            runId,
          });
          this.logger.log(`Session ${sessionId}: OpenAI run cancelled`);
        } catch (error) {
          this.logger.error(
            `Failed to cancel OpenAI run for session ${sessionId}:`,
            error,
          );
        }
      }
    }

    if (activeMessage) {
      await this.messageQueueService.markMessageCancelled(
        sessionId,
        activeMessage.messageId,
      );
      this.logger.log(`Session ${sessionId}: message ${activeMessage.messageId} marked as cancelled`);
      return true;
    }

    this.logger.warn(`Session ${sessionId}: no active message to cancel`);
    return false;
  }
}
