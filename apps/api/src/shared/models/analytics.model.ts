import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Analytics {
  @Field()
  readonly funnelsCount: number;

  @Field()
  readonly views: number;

  @Field()
  readonly clicks: number;

  @Field()
  readonly conversionRate: number;
}
