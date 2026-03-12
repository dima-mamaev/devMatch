import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { Sort } from '../../shared/enums/sort.enum';

@InputType()
export class DeveloperSortInput {
  @Field(() => Sort, { nullable: true })
  @IsOptional()
  @IsEnum(Sort)
  createdAt?: Sort;

  @Field(() => Sort, { nullable: true })
  @IsOptional()
  @IsEnum(Sort)
  seniorityLevel?: Sort;

  @Field(() => Sort, { nullable: true })
  @IsOptional()
  @IsEnum(Sort)
  firstName?: Sort;

  @Field(() => Sort, { nullable: true })
  @IsOptional()
  @IsEnum(Sort)
  lastName?: Sort;
}
