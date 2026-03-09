import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserQuery } from './models/user.query.model';
import { User } from './models/user.entity';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';
import { UserService } from './user.service';
import { GetUserInput } from './inputs/get-user.input';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { UserPagingResult } from './models/user-paging-result';
import { PagingInput } from '../shared/inputs/paging.input';
import { UserFilterInput } from './inputs/user-filter.input';
import { UserSortInput } from './inputs/user-sort.input';

@Resolver(() => UserQuery)
export class UserQueryResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserQuery)
  user() {
    return {};
  }

  @ResolveField(() => User, {
    description: 'Get current user',
  })
  @Roles()
  getMe(@ActiveUser() { id }: User) {
    return this.userService.findOneBy({ id });
  }

  @ResolveField(() => User, {
    description: 'Get user by id (Admin only)',
  })
  @Roles([UserRole.Admin])
  getUser(@Args('input') { id }: GetUserInput) {
    return this.userService.findOneBy({ id });
  }

  @ResolveField(() => UserPagingResult, {
    description: 'Get users with filtering, sorting and paging (Admin only)',
  })
  @Roles([UserRole.Admin])
  getUsers(
    @Args('paging', { nullable: true }) paging: PagingInput,
    @Args('filter', { nullable: true }) filter?: UserFilterInput,
    @Args('sort', { nullable: true }) sort?: UserSortInput,
  ) {
    return this.userService.getUsersWithSortAndPaging(paging, filter, sort);
  }
}
