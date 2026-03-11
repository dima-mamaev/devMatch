export type UserType = 'guest' | 'authenticated';

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetsAt: string;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  info: RateLimitInfo;
}
