import { Field, ID, InputType } from '@nestjs/graphql';
import type { UUID } from 'crypto';

@InputType()
export class GetUserInput {
  @Field(() => ID)
  id: UUID;
}
