import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { SessionState, ConversationMessage } from './session.types.js';

@Injectable()
export class SessionService implements OnModuleDestroy {
  private readonly logger = new Logger(SessionService.name);
  private redis: Redis;
  private openai: OpenAI | null = null;
  private readonly SESSION_TTL = 60 * 60 * 2;
  private readonly USER_THREAD_TTL = 60 * 60 * 24 * 7;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });

    const apiKey = this.configService.get('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async getOrCreateSession(
    sessionId: string | null,
    userId: string | null,
  ): Promise<SessionState> {
    if (userId) {
      const userSession = await this.getSessionByUserId(userId);
      if (userSession) {
        await this.touchSession(userSession.sessionId);
        return userSession;
      }

      await this.cleanupUserThread(userId);

      const newSessionId = randomUUID();
      const session: SessionState = {
        sessionId: newSessionId,
        userId,
        threadId: null,
        messageQueue: [],
        conversationHistory: [],
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };
      await this.saveSession(session);
      await this.redis.setex(
        `ai-match:user-session:${userId}`,
        this.SESSION_TTL,
        newSessionId,
      );
      return session;
    }

    if (sessionId) {
      const existing = await this.getSession(sessionId);
      if (existing && !existing.userId) {
        await this.touchSession(sessionId);
        return existing;
      }
    }

    const newSessionId = randomUUID();
    const session: SessionState = {
      sessionId: newSessionId,
      userId: null,
      threadId: null,
      messageQueue: [],
      conversationHistory: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    await this.saveSession(session);
    return session;
  }

  async getSessionByUserId(userId: string): Promise<SessionState | null> {
    const sessionId = await this.redis.get(`ai-match:user-session:${userId}`);
    if (!sessionId) return null;
    return this.getSession(sessionId);
  }

  async addMessageToHistory(
    sessionId: string,
    message: ConversationMessage,
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      if (!session.conversationHistory) {
        session.conversationHistory = [];
      }
      session.conversationHistory.push(message);
      await this.saveSession(session);
    }
  }

  async updateLastAssistantMessage(
    sessionId: string,
    messageId: string,
    updates: Partial<ConversationMessage>,
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session?.conversationHistory) {
      const message = session.conversationHistory.find(
        (m) => m.id === messageId,
      );
      if (message) {
        Object.assign(message, updates);
        await this.saveSession(session);
      }
    }
  }

  async getSession(sessionId: string): Promise<SessionState | null> {
    const data = await this.redis.get(`ai-match:session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  async saveSession(session: SessionState): Promise<void> {
    session.lastActivityAt = new Date().toISOString();
    await this.redis.setex(
      `ai-match:session:${session.sessionId}`,
      this.SESSION_TTL,
      JSON.stringify(session),
    );
    if (session.userId) {
      await this.redis.expire(
        `ai-match:user-session:${session.userId}`,
        this.SESSION_TTL,
      );
    }
  }

  async touchSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    await this.redis.expire(`ai-match:session:${sessionId}`, this.SESSION_TTL);
    if (session?.userId) {
      await this.redis.expire(
        `ai-match:user-session:${session.userId}`,
        this.SESSION_TTL,
      );
    }
  }

  async setThreadId(sessionId: string, threadId: string | null): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      session.threadId = threadId;
      await this.saveSession(session);

      if (session.userId && threadId) {
        await this.redis.setex(
          `ai-match:user-thread:${session.userId}`,
          this.USER_THREAD_TTL,
          threadId,
        );
      }
    }
  }

  async getCurrentRunId(sessionId: string): Promise<string | null> {
    return this.redis.get(`ai-match:run:${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    if (session.threadId) {
      await this.deleteOpenAIThread(session.threadId);
    }

    await this.redis.del(`ai-match:session:${sessionId}`);
    if (session.userId) {
      await this.redis.del(`ai-match:user-session:${session.userId}`);
      await this.redis.del(`ai-match:user-thread:${session.userId}`);
    }
  }

  private async cleanupUserThread(userId: string): Promise<void> {
    const oldThreadId = await this.redis.get(`ai-match:user-thread:${userId}`);
    if (oldThreadId) {
      await this.deleteOpenAIThread(oldThreadId);
      await this.redis.del(`ai-match:user-thread:${userId}`);
    }
  }

  private async deleteOpenAIThread(threadId: string): Promise<void> {
    if (!this.openai) return;

    try {
      await this.openai.beta.threads.delete(threadId);
      this.logger.debug(`Deleted OpenAI thread: ${threadId}`);
    } catch (error) {
      this.logger.warn(
        `Failed to delete OpenAI thread ${threadId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
