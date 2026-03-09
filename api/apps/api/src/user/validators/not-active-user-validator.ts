import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import type { UUID } from 'crypto';
import { ClsService } from 'nestjs-cls';
import { User } from '../models/user.entity';

@Injectable()
@ValidatorConstraint()
export class NotActiveUserValidator implements ValidatorConstraintInterface {
  constructor(private readonly cls: ClsService) {}

  validate(val: UUID) {
    const user = this.cls.get<User | undefined>('user');
    return user?.id !== val;
  }

  defaultMessage() {
    return 'Forbidden';
  }
}
