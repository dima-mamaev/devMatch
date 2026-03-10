import { Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { UserMutation } from './models/user.mutation.model';
import { UserService } from './user.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { User } from './models/user.entity';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { DeleteResult } from '../shared/models/delete-result.model';

@Resolver(() => UserMutation)
export class UserMutationResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserMutation)
  user() {
    return {};
  }

  @ResolveField(() => DeleteResult, {
    description: 'Delete self',
  })
  @Roles()
  deleteMe(@ActiveUser() { id }: User) {
    return this.userService.deleteUser(id);
  }
}
