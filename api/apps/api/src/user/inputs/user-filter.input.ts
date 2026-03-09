import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UserFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  readonly search?: string;
}
