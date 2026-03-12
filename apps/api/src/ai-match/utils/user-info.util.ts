import { User } from '../../user/models/user.entity.js';
import { UserType } from '../rate-limit/rate-limit.types.js';

export interface UserInfo {
  userType: UserType;
  identifier: string;
}

export interface RequestContext {
  req?: {
    ip?: string;
    headers?: Record<string, string>;
  };
}

export function getUserInfo(user: User | null, ctx: RequestContext): UserInfo {
  if (!user) {
    const ip = ctx.req?.ip || ctx.req?.headers?.['x-forwarded-for'] || 'unknown';
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
