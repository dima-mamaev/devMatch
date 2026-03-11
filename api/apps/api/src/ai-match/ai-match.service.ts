import { Injectable, Logger } from '@nestjs/common';
import { AIAgentClient } from './http/ai-agent.client.js';
import { MessageQueueService } from './queue/message-queue.service.js';
import { SessionService } from './session/session.service.js';
import { PubSubService } from './streaming/pubsub.service.js';
import { AIMatchEventType, createEvent } from '../../../../libs/shared/src/types/event.types.js';

@Injectable()
export class AIMatchService {
  private readonly logger = new Logger(AIMatchService.name);
  // Track active processors per session to prevent race conditions
  private activeProcessors = new Set<string>();

  constructor(
    private aiAgentClient: AIAgentClient,
    private messageQueueService: MessageQueueService,
    private sessionService: SessionService,
    private pubsubService: PubSubService,
  ) {}

  /**
   * Process the message queue for a session.
   * Uses a lock to ensure only one processor runs per session at a time.
   */
  async processQueue(sessionId: string): Promise<void> {
    // Prevent concurrent processors for the same session
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

  /**
   * Process a single message by calling AI Agent microservice
   */
  private async processMessage(
    sessionId: string,
    messageId: string,
    prompt: string,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Mark message as started (publishes MESSAGE_STARTED event)
      await this.messageQueueService.markMessageStarted(sessionId, messageId);
      this.logger.log(`Message ${messageId}: marked as started`);

      // Get session for threadId
      const session = await this.sessionService.getSession(sessionId);

      // Call AI Agent microservice via HTTP
      // The service will publish events to Redis as it processes
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

      // Update threadId if returned (for conversation continuity)
      if (response.threadId && response.threadId !== session?.threadId) {
        await this.sessionService.setThreadId(sessionId, response.threadId);
        this.logger.log(`Message ${messageId}: threadId updated to ${response.threadId}`);
      }

      // Mark message as completed
      await this.messageQueueService.markMessageCompleted(sessionId, messageId);

      const duration = Date.now() - startTime;
      this.logger.log(`Message ${messageId}: completed in ${duration}ms`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Message ${messageId}: failed after ${duration}ms - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      // Mark message as failed and emit error
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

  /**
   * Cancel the currently running OpenAI run
   */
  async cancelCurrentRun(sessionId: string): Promise<boolean> {
    this.logger.log(`Cancel requested for session ${sessionId}`);

    const session = await this.sessionService.getSession(sessionId);
    if (!session) {
      this.logger.warn(`Session ${sessionId} not found for cancel`);
      return false;
    }

    // Find any active message (processing or queued)
    const activeMessage = session.messageQueue?.find(
      (m) => m.status === 'processing' || m.status === 'queued',
    );

    this.logger.log(
      `Session ${sessionId}: threadId=${session.threadId}, activeMessage=${activeMessage?.messageId}, status=${activeMessage?.status}`,
    );

    // Try to cancel the OpenAI run if we have the required info
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

    // Mark message as cancelled and notify frontend
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
