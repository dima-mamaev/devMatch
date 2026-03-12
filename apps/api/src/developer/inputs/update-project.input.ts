import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';
import type { UUID } from 'crypto';

@InputType()
export class UpdateProjectInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  id: UUID;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  url?: string;
}
