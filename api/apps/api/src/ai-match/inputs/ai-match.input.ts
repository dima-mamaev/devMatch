import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class AIMatchSendInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  sessionId: string; // Session ID from aiMatchStartSession

  @Field()
  @IsNotEmpty()
  @IsString()
  prompt: string; // Natural language search query

  @Field(() => [String], { nullable: true })
  @IsOptional()
  excludeDeveloperIds?: string[]; // Exclude already reviewed developers
}

@InputType()
export class AIMatchCancelInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  target: string; // 'current' | 'queued' | 'all'

  @Field(() => String, { nullable: true })
  @IsOptional()
  messageId?: string; // Required when target is 'queued'
}
