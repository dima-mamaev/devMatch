import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import type { UUID } from 'crypto';
import { AvailabilityStatus } from '../../shared/enums/availability-status.enum';
import { SeniorityLevel } from '../../shared/enums/seniority-level.enum';

@InputType()
export class DeveloperFilterInput {
  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  excludeIds?: UUID[]; // Exclude specific developer IDs

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string; // Search in firstName, lastName, jobTitle, bio

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[]; // Filter by tech stack (any match)

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field(() => [SeniorityLevel], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(SeniorityLevel, { each: true })
  seniorityLevels?: SeniorityLevel[]; // Filter by seniority levels

  @Field(() => [AvailabilityStatus], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(AvailabilityStatus, { each: true })
  availabilityStatus?: AvailabilityStatus[];
}
