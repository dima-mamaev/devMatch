import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SessionService } from '../session/session.service.js';
import { PubSubService } from '../streaming/pubsub.service.js';
import { AIMatchEventType, createEvent } from '../../../../../libs/shared/src/types/event.types.js';
import { QueuedMessage, MessageStatus } from './queue.types.js';

@Injectable()
export class MessageQueueService {
  constructor(
    private sessionService: SessionService,
    private pubsubService: PubSubService,
  ) { }

  async enqueueMessage(
    sessionId: string,
    prompt: string,
  ): Promise<QueuedMessage> {
    const session = await this.sessionService.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const message: QueuedMessage = {
      messageId: randomUUID(),
      prompt,
      status: 'queued',
      queuedAt: new Date().toISOString(),
    };

    session.messageQueue.push(message);
    await this.sessionService.saveSession(session);

    await this.pubsubService.publish(
      sessionId,
      createEvent(AIMatchEventType.MESSAGE_QUEUED, sessionId, message.messageId, {
        position: session.messageQueue.length,
        prompt: message.prompt,
      }),
    );

    return message;
  }

  async getNextMessage(sessionId: string): Promise<QueuedMessage | null> {
    const session = await this.sessionService.getSession(sessionId);
    if (!session) return null;

    return session.messageQueue.find((m) => m.status === 'queued') || null;
  }

  async markMessageStarted(
    sessionId: string,
    messageId: string,
  ): Promise<void> {
    const message = await this.updateMessageStatus(sessionId, messageId, 'processing', {
      startedAt: new Date().toISOString(),
    });

    if (message) {
      await this.pubsubService.publish(
        sessionId,
        createEvent(AIMatchEventType.MESSAGE_STARTED, sessionId, messageId, {
          prompt: message.prompt,
        }),
      );
    }
  }

  async markMessageCompleted(
    sessionId: string,
    messageId: string,
  ): Promise<void> {
    await this.updateMessageStatus(sessionId, messageId, 'completed', {
      completedAt: new Date().toISOString(),
    });
  }

  async cancelMessage(sessionId: string, messageId: string): Promise<boolean> {
    const session = await this.sessionService.getSession(sessionId);
    if (!session) return false;

    const message = session.messageQueue.find((m) => m.messageId === messageId);
    if (message && message.status === 'queued') {
      message.status = 'cancelled';
      await this.sessionService.saveSession(session);

      await this.pubsubService.publish(
        sessionId,
        createEvent(AIMatchEventType.CANCELLED, sessionId, messageId, {
          reason: 'user_cancelled',
        }),
      );
      return true;
    }
    return false;
  }

  async getQueueStatus(sessionId: string): Promise<{
    processing: QueuedMessage | null;
    queued: QueuedMessage[];
  }> {
    const session = await this.sessionService.getSession(sessionId);
    if (!session) {
      return { processing: null, queued: [] };
    }

    return {
      processing:
        session.messageQueue.find((m) => m.status === 'processing') || null,
      queued: session.messageQueue.filter((m) => m.status === 'queued'),
    };
  }

  async markMessageFailed(sessionId: string, messageId: string): Promise<void> {
    await this.updateMessageStatus(sessionId, messageId, 'failed', {
      completedAt: new Date().toISOString(),
    });
  }

  async markMessageCancelled(
    sessionId: string,
    messageId: string,
  ): Promise<void> {
    const message = await this.updateMessageStatus(
      sessionId,
      messageId,
      'cancelled',
      { completedAt: new Date().toISOString() },
      'processing', // Only cancel if currently processing
    );

    if (message) {
      await this.pubsubService.publish(
        sessionId,
        createEvent(AIMatchEventType.CANCELLED, sessionId, messageId, {
          reason: 'run_cancelled',
        }),
      );
    }
  }

  private async updateMessageStatus(
    sessionId: string,
    messageId: string,
    newStatus: MessageStatus,
    updates: Partial<QueuedMessage> = {},
    requiredStatus?: MessageStatus,
  ): Promise<QueuedMessage | null> {
    const session = await this.sessionService.getSession(sessionId);
    if (!session) return null;

    const message = session.messageQueue.find((m) => m.messageId === messageId);
    if (!message) return null;
    if (requiredStatus && message.status !== requiredStatus) return null;

    message.status = newStatus;
    Object.assign(message, updates);
    await this.sessionService.saveSession(session);

    return message;
  }
}
