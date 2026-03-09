import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { PagingResult } from '../../shared/models/paging-result.model';

@ObjectType({ description: 'User paging result' })
export class UserPagingResult extends PagingResult<User> {
  @Field(() => [User])
  declare readonly results: User[];
}
