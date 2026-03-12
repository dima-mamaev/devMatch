import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { AvailabilityStatus } from '../../shared/enums/availability-status.enum';
import { SeniorityLevel } from '../../shared/enums/seniority-level.enum';

@InputType()
export class UpdateDeveloperInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  jobTitle?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @Field(() => SeniorityLevel, { nullable: true })
  @IsOptional()
  @IsEnum(SeniorityLevel)
  seniorityLevel?: SeniorityLevel;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  personalSiteUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @Field(() => AvailabilityStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AvailabilityStatus)
  availabilityStatus?: AvailabilityStatus;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;
}
