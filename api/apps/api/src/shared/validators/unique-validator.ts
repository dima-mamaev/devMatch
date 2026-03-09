import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Not, ObjectLiteral } from 'typeorm';
import convert from 'url-slug';
import { BasicService } from '../services/basic.service';

type ValidatorParams = {
  service: new (...args: any[]) => any;
  prop?: string;
};

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  static params(params: ValidatorParams) {
    return [params];
  }

  constructor(private readonly moduleRef: ModuleRef) {}

  async validate(val: string, { constraints, object }: ValidationArguments) {
    const [{ service, prop = 'name' }] = constraints as ValidatorParams[];
    const injectedService = this.moduleRef.get<BasicService<ObjectLiteral>>(
      service,
      { strict: false },
    );
    const id =
      'id' in object ? (object as { id?: string | number }).id : undefined;
    const entity = await injectedService.findOneBy({
      [prop]: convert(val.toLowerCase()),
      ...(id && { id: Not(id) }),
    });
    return !entity;
  }

  defaultMessage() {
    return 'This name already exists';
  }
}
