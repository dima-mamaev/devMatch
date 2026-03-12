import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserQuery } from './models/user.query.model';
import { User } from './models/user.entity';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserService } from './user.service';
import { ActiveUser } from '../shared/decorators/active-user.decorator';

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
}
