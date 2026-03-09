import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import type { UUID } from 'crypto';
import { Shortlist } from './models/shortlist.entity';
import { ShortlistService } from './shortlist.service';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { Roles } from '../shared/decorators/roles.decorator';
import { User } from '../user/models/user.entity';
import { UserRole } from '../shared/enums/user-role.enum';

@Resolver(() => Shortlist)
export class ShortlistResolver {
  constructor(private readonly shortlistService: ShortlistService) {}

  // ==================== QUERIES ====================

  @Query(() => [Shortlist], { description: 'Get current user shortlist' })
  @Roles([UserRole.Developer, UserRole.Recruiter])
  async getMyShortlist(@ActiveUser() user: User): Promise<Shortlist[]> {
    if (!user) {
      throw new ForbiddenException('You must be logged in');
    }
    return this.shortlistService.getShortlist(user.id);
  }

  @Query(() => Int, { description: 'Get shortlist count' })
  @Roles([UserRole.Developer, UserRole.Recruiter])
  async getMyShortlistCount(@ActiveUser() user: User): Promise<number> {
    if (!user) {
      throw new ForbiddenException('You must be logged in');
    }
    return this.shortlistService.getShortlistCount(user.id);
  }

  @Query(() => Boolean, { description: 'Check if developer is in shortlist' })
  @Roles([UserRole.Developer, UserRole.Recruiter])
  async isInMyShortlist(
    @ActiveUser() user: User,
    @Args('developerId', { type: () => ID }) developerId: UUID,
  ): Promise<boolean> {
    if (!user) {
      throw new ForbiddenException('You must be logged in');
    }
    return this.shortlistService.isInShortlist(user.id, developerId);
  }

  // ==================== MUTATIONS ====================

  @Mutation(() => Shortlist, { description: 'Add developer to shortlist' })
  @Roles([UserRole.Developer, UserRole.Recruiter])
  async addToShortlist(
    @ActiveUser() user: User,
    @Args('developerId', { type: () => ID }) developerId: UUID,
  ): Promise<Shortlist> {
    if (!user) {
      throw new ForbiddenException('You must be logged in');
    }
    return this.shortlistService.addToShortlist(user, developerId);
  }

  @Mutation(() => Boolean, { description: 'Remove developer from shortlist' })
  @Roles([UserRole.Developer, UserRole.Recruiter])
  async removeFromShortlist(
    @ActiveUser() user: User,
    @Args('developerId', { type: () => ID }) developerId: UUID,
  ): Promise<boolean> {
    if (!user) {
      throw new ForbiddenException('You must be logged in');
    }
    return this.shortlistService.removeFromShortlist(user.id, developerId);
  }

  @Mutation(() => Boolean, { description: 'Clear entire shortlist' })
  @Roles([UserRole.Developer, UserRole.Recruiter])
  async clearMyShortlist(@ActiveUser() user: User): Promise<boolean> {
    if (!user) {
      throw new ForbiddenException('You must be logged in');
    }
    return this.shortlistService.clearShortlist(user.id);
  }
}
