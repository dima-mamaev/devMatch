import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { UUID } from 'crypto';
import { Recruiter } from './models/recruiter.entity';
import { RecruiterService } from './recruiter.service';
import { UpdateRecruiterInput } from './inputs/update-recruiter.input';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { User } from '../user/models/user.entity';

@Resolver(() => Recruiter)
export class RecruiterResolver {
  constructor(
    private readonly recruiterService: RecruiterService,
  ) {}

  private async getRecruiterOrFail(userId: UUID): Promise<Recruiter> {
    const recruiter = await this.recruiterService.findByUserId(userId);
    if (!recruiter) {
      throw new NotFoundException('Recruiter profile not found');
    }
    return recruiter;
  }

  @Query(() => Recruiter, { nullable: true, description: 'Get current user recruiter profile' })
  @Roles([UserRole.Recruiter])
  async getMyRecruiterProfile(
    @ActiveUser() user: User,
  ): Promise<Recruiter | null> {
    return this.recruiterService.findByUserId(user.id);
  }

  @Mutation(() => Recruiter, { description: 'Create initial recruiter profile' })
  @Roles([UserRole.Recruiter])
  async createRecruiterProfile(
    @ActiveUser() user: User,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ): Promise<Recruiter> {
    const existing = await this.recruiterService.findByUserId(user.id);
    if (existing) {
      throw new ForbiddenException('Recruiter profile already exists');
    }
    return this.recruiterService.createRecruiter(user, firstName, lastName);
  }

  @Mutation(() => Recruiter, { description: 'Update recruiter profile' })
  @Roles([UserRole.Recruiter])
  async updateRecruiterProfile(
    @ActiveUser() user: User,
    @Args('input') input: UpdateRecruiterInput,
  ): Promise<Recruiter> {
    const recruiter = await this.getRecruiterOrFail(user.id);
    return this.recruiterService.updateRecruiter(recruiter.id, input);
  }
}
