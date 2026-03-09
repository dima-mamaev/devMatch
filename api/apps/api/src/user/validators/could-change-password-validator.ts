import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClsService } from 'nestjs-cls';
import { User } from '../models/user.entity';
import { getAuthProvider } from '../../shared/utils/get-auth-provider';

@Injectable()
@ValidatorConstraint()
export class CouldChangePasswordValidator implements ValidatorConstraintInterface {
  constructor(private readonly cls: ClsService) {}

  validate() {
    const user = this.cls.get<User | undefined>('user');
    return !!user && getAuthProvider(user.auth0Id) === 'auth0';
  }

  defaultMessage() {
    return 'Function is not supported';
  }
}
