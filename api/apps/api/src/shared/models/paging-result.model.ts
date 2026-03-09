import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Common paging result' })
export class PagingResult<T> {
  @Field({ nullable: true })
  readonly page?: number;

  @Field({ nullable: true })
  readonly total?: number;

  @Field({ nullable: true })
  readonly limit?: number;

  readonly results: T[];
}
