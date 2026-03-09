import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { Sort } from '../../shared/enums/sort.enum';

@InputType()
export class UserSortInput {
  @Field(() => Sort, { nullable: true })
  @IsOptional()
  @IsEnum(Sort)
  readonly id?: Sort;

  @Field(() => Sort, { nullable: true })
  @IsOptional()
  @IsEnum(Sort)
  readonly name?: Sort;

  @Field(() => Sort, { nullable: true })
  @IsOptional()
  @IsEnum(Sort)
  readonly email?: Sort;

  @Field(() => Sort, { nullable: true })
  @IsOptional()
  @IsEnum(Sort)
  readonly role?: Sort;

  @Field(() => Sort, { nullable: true })
  @IsOptional()
  @IsEnum(Sort)
  readonly status?: Sort;
}
