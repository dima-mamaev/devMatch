import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '../enums/user-role.enum';
import { Roles } from '../decorators/roles.decorator';
import { ContextWithUser } from '../../../../../types/types';
import { User } from '../../user/models/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<ContextWithUser>().req;
    const handler = ctx.getHandler();
    const roles = this.reflector.get<UserRole[]>(Roles, handler);
    const user = req?.user as User;

    if (roles && !user) {
      throw new UnauthorizedException('Authentication failed');
    }
    if (!roles || (!roles.length && user)) {
      return true;
    }
    if (roles.length && user) {
      const hasPermission = () => roles.includes(user.role);

      return user.role && hasPermission();
    }
    return false;
  }
}
