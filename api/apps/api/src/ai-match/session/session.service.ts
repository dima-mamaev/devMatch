import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { SessionState } from './session.types.js';

@Injectable()
export class SessionService implements OnModuleDestroy {
  private redis: Redis;
  private readonly SESSION_TTL = 60 * 60 * 24; // 24 hours

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async getOrCreateSession(
    sessionId: string | null,
    userId: string | null,
  ): Promise<SessionState> {
    if (sessionId) {
      const existing = await this.getSession(sessionId);
      if (existing) {
        await this.touchSession(sessionId);
        return existing;
      }
    }

    // Create new session
    const newSessionId = sessionId || randomUUID();
    const session: SessionState = {
      sessionId: newSessionId,
      userId,
      threadId: null,
      messageQueue: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    await this.saveSession(session);
    return session;
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
  }

  async touchSession(sessionId: string): Promise<void> {
    await this.redis.expire(`ai-match:session:${sessionId}`, this.SESSION_TTL);
  }

  async setThreadId(sessionId: string, threadId: string | null): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      session.threadId = threadId;
      await this.saveSession(session);
    }
  }

  /**
   * Get current run ID from Redis (stored by AI Agent service)
   */
  async getCurrentRunId(sessionId: string): Promise<string | null> {
    return this.redis.get(`ai-match:run:${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.redis.del(`ai-match:session:${sessionId}`);
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
