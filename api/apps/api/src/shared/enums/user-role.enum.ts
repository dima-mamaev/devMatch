import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  Admin = 'Admin',
  Developer = 'Developer',
  Recruiter = 'Recruiter',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role',
});
