import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'User status',
});
