import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { Auth0Service } from '../services/auth0.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/models/user.entity';
import { RequestWithUser } from '../../../../../types/types';
import { UserStatus } from '../enums/user-status.enum';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly auth0Service: Auth0Service,
  ) { }

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const auth0Id = await this.auth0Service.getAuth0Id({ req, res });
      let user = await this.userService.findOneBy({ auth0Id });

      if (user?.status === UserStatus.Inactive && auth0Id) {
        const { data } = await this.auth0Service.users.get({
          id: auth0Id,
        });
        const status = data.email_verified
          ? UserStatus.Active
          : UserStatus.Inactive;
        Object.assign(user, { status });
        user = await this.userService.save(user);
      }

      if (!user && auth0Id) {
        const { data } = await this.auth0Service.users.get({
          id: auth0Id,
        });
        const roleHeader = req.headers['x-user-role'] as string;
        const role =
          roleHeader === UserRole.Recruiter
            ? UserRole.Recruiter
            : UserRole.Developer;

        const firstName =
          data.given_name || data.user_metadata?.firstName || data.name?.split(' ')[0];
        const lastName =
          data.family_name || data.user_metadata?.lastName || data.name?.split(' ').slice(1).join(' ');

        const userEntity = this.userService.createEntity({
          auth0Id,
          email: data.email,
          firstName,
          lastName,
          status: data.email_verified
            ? UserStatus.Active
            : UserStatus.Inactive,
          role,
        });
        user = await this.userService.save(userEntity);
      }

      req.user = plainToInstance(User, user);
      next();
    } catch (error) {
      next();
    }
  }
}
