import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import type { UUID } from 'crypto';

@InputType()
export class UpdateExperienceInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  id: UUID;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  position?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1950)
  startYear?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1950)
  endYear?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
