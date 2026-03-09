import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { BasicService } from '../services/basic.service';

type ValidatorParams = {
  service: new (...args: any[]) => any;
  reverse?: boolean;
  prop?: string;
  where?: FindOptionsWhere<ObjectLiteral>;
  withDeleted?: boolean;
};

@Injectable()
@ValidatorConstraint({ async: true })
export class ShouldExistValidator implements ValidatorConstraintInterface {
  static params(params: ValidatorParams) {
    return [params];
  }

  constructor(private readonly moduleRef: ModuleRef) {}

  validate(val: string | string[], { constraints }: ValidationArguments) {
    const [
      {
        service,
        reverse = false,
        prop = 'id',
        where = {},
        withDeleted = false,
      },
    ] = constraints as ValidatorParams[];
    const injectedService = this.moduleRef.get<BasicService<ObjectLiteral>>(
      service,
      { strict: false },
    );

    return (Array.isArray(val) ? val : [val]).reduce<Promise<boolean>>(
      async (acc, value) => {
        const res = await acc;
        const instance = await injectedService
          .findOne({ where: { ...where, [prop]: value }, withDeleted })
          .catch(() => null);

        return res && reverse ? !instance : !!instance;
      },
      Promise.resolve(true),
    );
  }

  defaultMessage({ constraints }: ValidationArguments) {
    const [{ reverse = false }] = constraints as ValidatorParams[];
    return reverse ? 'Already exists' : 'Does not exist';
  }
}
