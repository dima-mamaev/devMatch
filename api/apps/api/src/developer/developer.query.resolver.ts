import { Args, ID, Query, Resolver } from '@nestjs/graphql';
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
  constructor(private readonly developerService: DeveloperService) {}

  // Public - anyone can view developers
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

  // Public - anyone can view a single developer
  @Query(() => Developer, { nullable: true, description: 'Get a single developer by ID' })
  async getDeveloper(
    @Args('id', { type: () => ID }) id: UUID,
  ): Promise<Developer | null> {
    return this.developerService.findById(id);
  }

  // Authenticated - Developer only
  @Query(() => Developer, { nullable: true, description: 'Get current user developer profile' })
  @Roles([UserRole.Developer])
  async getMyDeveloperProfile(
    @ActiveUser() user: User,
  ): Promise<Developer | null> {
    return this.developerService.findByUserId(user.id);
  }
}
