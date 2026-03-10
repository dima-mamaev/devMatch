import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { UUID } from 'crypto';
import { Developer } from './models/developer.entity';
import { DeveloperService } from './developer.service';
import { DeveloperFilterInput } from './inputs/developer-filter.input';
import { DeveloperSortInput } from './inputs/developer-sort.input';
import { PagingInput } from '../shared/inputs/paging.input';
import { DeveloperConnection } from './models/developer-connection.type';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { User } from '../user/models/user.entity';

@Resolver(() => Developer)
export class DeveloperQueryResolver {
  constructor(private readonly developerService: DeveloperService) { }

  @ResolveField(() => String, { description: 'Developer email from associated user' })
  async email(@Parent() developer: Developer): Promise<string> {
    if (developer.user?.email) {
      return developer.user.email;
    }
    const developerWithUser = await this.developerService.findById(developer.id);
    return developerWithUser?.user?.email ?? '';
  }

  @Query(() => DeveloperConnection, { description: 'Get all developers with pagination and filtering' })
  async getDevelopers(
    @Args('paging', { nullable: true }) paging?: PagingInput,
    @Args('filter', { nullable: true }) filter?: DeveloperFilterInput,
    @Args('sort', { nullable: true }) sort?: DeveloperSortInput,
  ): Promise<DeveloperConnection> {
    return this.developerService.getDevelopersWithPaging(
      paging ?? {},
      filter ?? {},
      sort,
    );
  }

  @Query(() => Developer, { nullable: true, description: 'Get a single developer by ID' })
  async getDeveloper(
    @Args('id', { type: () => ID }) id: UUID,
  ): Promise<Developer | null> {
    return this.developerService.findById(id);
  }

  @Query(() => Developer, { nullable: true, description: 'Get current user developer profile' })
  @Roles([UserRole.Developer])
  async getMyDeveloperProfile(
    @ActiveUser() user: User,
  ): Promise<Developer | null> {
    return this.developerService.findByUserId(user.id);
  }
}
