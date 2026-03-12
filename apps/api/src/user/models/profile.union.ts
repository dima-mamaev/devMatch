import { createUnionType } from '@nestjs/graphql';
import { Developer } from '../../developer/models/developer.entity';
import { Recruiter } from '../../recruiter/models/recruiter.entity';

export const Profile = createUnionType({
  name: 'Profile',
  types: () => [Developer, Recruiter] as const,
  resolveType(value) {
    if ('techStack' in value || 'seniorityLevel' in value) {
      return Developer;
    }
    return Recruiter;
  },
});

export type ProfileType = Developer | Recruiter;
