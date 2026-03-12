import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class AIMatchStartSessionInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sessionId?: string;
}

@InputType()
export class AIMatchSendInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  prompt: string;
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
  target: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  messageId?: string;
}
