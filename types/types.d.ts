import { Request } from 'express';
import { ClsStore } from 'nestjs-cls';
import { Context } from 'graphql-ws';
import { UUID } from 'crypto';
import { User } from '../apps/api/src/user/models/user.entity';

export type RequestWithUser = Request & { user?: User };

export type ContextWithUser = { req: RequestWithUser };

export type WsContextWithUser = Context<
  Record<string, string>,
  { user?: User }
>;

export type WsRequestWithUser = {
  req: Context<Record<string, unknown>, { user?: User }>;
};

export interface GenerateGroupInterface {
  generateGroups(): string[];
}

export interface AppClsStore extends ClsStore {
  user: User;
}

// Video Converter Queue Types
export type ConvertVideoInputData = {
  inputPath: string;
  developerId: UUID;
  videoMediaId: UUID; // Placeholder media record created before queueing
};

export type ConvertVideoOutputData = {
  outputPath: string;
  developerId: UUID;
  videoMediaId: UUID; // Passed through from input
};
