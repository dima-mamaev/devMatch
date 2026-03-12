import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from './models/user.entity';
import { getAuthProvider } from '../shared/utils/get-auth-provider';
import { Profile, ProfileType } from './models/profile.union';
import { UserRole } from '../shared/enums/user-role.enum';
import { DeveloperService } from '../developer/developer.service';
import { RecruiterService } from '../recruiter/recruiter.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly developerService: DeveloperService,
    private readonly recruiterService: RecruiterService,
  ) {}

  @ResolveField(() => String)
  authProvider(@Parent() user: User) {
    return getAuthProvider(user.auth0Id);
  }

  @ResolveField(() => Profile, { nullable: true })
  async profile(@Parent() user: User): Promise<ProfileType | null> {
    if (user.role === UserRole.Developer) {
      return this.developerService.findByUserId(user.id);
    }
    if (user.role === UserRole.Recruiter) {
      return this.recruiterService.findByUserId(user.id);
    }
    return null;
  }
}
