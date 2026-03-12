import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateExperienceInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  position: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  companyName: string;

  @Field(() => Int)
  @IsNotEmpty()
  @Min(1950)
  startYear: number;

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
