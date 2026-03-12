import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ContextWithUser } from '../../../../../types/types';
import { User } from '../../user/models/user.entity';
import { UserStatus } from '../enums/user-status.enum';

@Injectable()
export class SystemGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<ContextWithUser>().req;
    const user = req?.user as User;

    if (user?.status === UserStatus.Inactive) {
      throw new GraphQLError('User inactive', {
        extensions: { code: 'USER_INACTIVE' },
      });
    }
    if (user?.status === UserStatus.Suspended) {
      throw new GraphQLError('User suspended', {
        extensions: { code: 'USER_SUSPENDED' },
      });
    }

    return true;
  }
}
