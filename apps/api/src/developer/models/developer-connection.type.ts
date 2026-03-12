import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Developer } from './developer.entity';

@ObjectType({ description: 'Paginated list of developers' })
export class DeveloperConnection {
  @Field(() => [Developer])
  results: Developer[];

  @Field(() => Int)
  total: number;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;
}
