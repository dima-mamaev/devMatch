import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClsService } from 'nestjs-cls';
import { FindOptionsWhere, In, ObjectLiteral } from 'typeorm';
import { User } from '../../user/models/user.entity';
import { BasicService } from '../services/basic.service';
import { UserRole } from '../enums/user-role.enum';

type ValidatorParams = {
  service: new (...args: any[]) => any;
  adminAllowed?: boolean;
  where?: FindOptionsWhere<ObjectLiteral>;
};

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEntityCreatorValidator implements ValidatorConstraintInterface {
  static params(params: ValidatorParams) {
    return [params];
  }

  constructor(
    private readonly cls: ClsService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async validate(val: string | string[], { constraints }: ValidationArguments) {
    const user = this.cls.get<User | undefined>('user');
    if (!user) return false;

    const [{ adminAllowed, service, where = {} }] =
      constraints as ValidatorParams[];
    const injectedService = this.moduleRef.get<BasicService<ObjectLiteral>>(
      service,
      { strict: false },
    );
    if (!adminAllowed) {
      const entity = await injectedService.find({
        where: {
          id: In(Array.isArray(val) ? val : [val]),
          ...where,
          createdBy: { id: user.id },
        },
      });
      return entity.length === (Array.isArray(val) ? val.length : 1);
    }

    const entities = await injectedService.find({
      where: { id: In(Array.isArray(val) ? val : [val]), ...where },
    });
    return entities.reduce<Promise<boolean>>(async (acc, entity) => {
      const res = await acc;
      const createdBy = (await entity?.createdBy) as User;
      return (
        res &&
        ((!!entity && user.role === UserRole.Admin) ||
          (createdBy?.id === user.id &&
            [UserRole.Developer, UserRole.Recruiter].includes(user?.role)))
      );
    }, Promise.resolve(true));
  }

  defaultMessage() {
    return 'Forbidden';
  }
}
