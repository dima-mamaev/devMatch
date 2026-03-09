import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { UserMutation } from './models/user.mutation.model';
import { UserService } from './user.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { User } from './models/user.entity';
import { UserRole } from '../shared/enums/user-role.enum';
import { UpdateUserInput } from './inputs/update-user.input';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { DeleteUserInput } from './inputs/delete-user.input';
import { DeleteResult } from '../shared/models/delete-result.model';
import { ChangePasswordInput } from './inputs/change-password.input';
import { UpdateUserRoleInput } from './inputs/update-user-role.input';

@Resolver(() => UserMutation)
export class UserMutationResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserMutation)
  user() {
    return {};
  }

  @ResolveField(() => User, {
    description: 'Change own password',
  })
  @Roles()
  changePassword(
    @Args('input') { password }: ChangePasswordInput,
    @ActiveUser() user: User,
  ) {
    return this.userService.changePassword(password, user);
  }

  @ResolveField(() => User, {
    description: 'Update user status (Admin only)',
  })
  @Roles([UserRole.Admin])
  update(@Args('input') input: UpdateUserInput) {
    return this.userService.updateOne(input);
  }

  @ResolveField(() => User, {
    description: 'Update user role (Admin only)',
  })
  @Roles([UserRole.Admin])
  updateRole(@Args('input') input: UpdateUserRoleInput) {
    return this.userService.updateOne(input);
  }

  @ResolveField(() => DeleteResult, {
    description: 'Delete self',
  })
  @Roles()
  deleteMe(@ActiveUser() { id }: User) {
    return this.userService.deleteUser(id);
  }

  @ResolveField(() => DeleteResult, {
    description: 'Delete user (Admin only)',
  })
  @Roles([UserRole.Admin])
  delete(@Args('input') { id }: DeleteUserInput) {
    return this.userService.deleteUser(id);
  }
}
