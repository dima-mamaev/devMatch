import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Max } from 'class-validator';

@InputType()
export class PagingInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  readonly page?: number = 1;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  @Max(100)
  readonly limit?: number = 20;
}
