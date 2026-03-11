import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import {
  UserType,
  RateLimitInfo,
  RateLimitCheckResult,
} from './rate-limit.types.js';

const RATE_LIMITS: Record<UserType, number> = {
  guest: 3,
  authenticated: 20,
  recruiter: 1000, // Effectively unlimited
};

const MAX_RESULTS: Record<UserType, number> = {
  guest: 5,
  authenticated: 10,
  recruiter: 20,
};

@Injectable()
export class RateLimitService implements OnModuleDestroy {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async checkAndIncrement(
    identifier: string,
    userType: UserType,
  ): Promise<RateLimitCheckResult> {
    const key = `ai-match:rate-limit:${userType}:${identifier}`;
    const limit = RATE_LIMITS[userType];

    // Get current count
    const currentStr = await this.redis.get(key);
    const current = currentStr ? parseInt(currentStr, 10) : 0;

    // Calculate reset time (midnight UTC)
    const now = new Date();
    const resetDate = new Date(now);
    resetDate.setUTCDate(resetDate.getUTCDate() + 1);
    resetDate.setUTCHours(0, 0, 0, 0);
    const ttl = Math.floor((resetDate.getTime() - now.getTime()) / 1000);

    if (current >= limit) {
      return {
        allowed: false,
        info: {
          remaining: 0,
          limit,
          resetsAt: resetDate.toISOString(),
        },
      };
    }

    // Increment counter
    await this.redis.incr(key);
    // Set expiry if this is the first request
    if (current === 0) {
      await this.redis.expire(key, ttl);
    }

    return {
      allowed: true,
      info: {
        remaining: limit - current - 1,
        limit,
        resetsAt: resetDate.toISOString(),
      },
    };
  }

  async getRateLimitInfo(
    identifier: string,
    userType: UserType,
  ): Promise<RateLimitInfo> {
    const key = `ai-match:rate-limit:${userType}:${identifier}`;
    const limit = RATE_LIMITS[userType];

    const currentStr = await this.redis.get(key);
    const current = currentStr ? parseInt(currentStr, 10) : 0;

    // Calculate reset time (midnight UTC)
    const now = new Date();
    const resetDate = new Date(now);
    resetDate.setUTCDate(resetDate.getUTCDate() + 1);
    resetDate.setUTCHours(0, 0, 0, 0);

    return {
      remaining: Math.max(0, limit - current),
      limit,
      resetsAt: resetDate.toISOString(),
    };
  }

  getMaxResults(userType: UserType): number {
    return MAX_RESULTS[userType];
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
