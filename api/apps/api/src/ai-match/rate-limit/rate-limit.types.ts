export type UserType = 'guest' | 'authenticated' | 'recruiter';

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetsAt: string;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  info: RateLimitInfo;
}
