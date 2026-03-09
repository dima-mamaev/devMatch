import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CustomUpload } from '../model/upload';

type ValidatorParams = { maxSize: number };

@Injectable()
@ValidatorConstraint({ async: true })
export class IsFileSize implements ValidatorConstraintInterface {
  static params(params: ValidatorParams) {
    return [params];
  }

  async validate(
    value: Promise<CustomUpload>,
    validatorArguments: ValidationArguments,
  ) {
    const [params] = validatorArguments.constraints as ValidatorParams[];
    const file = await value;

    const maxSize = 1024 * 1024 * params.maxSize; // maxSize in MB
    return file.buffer.length <= maxSize;
  }

  defaultMessage({ constraints }: ValidationArguments) {
    const [params] = constraints as ValidatorParams[];
    return `File must be less than ${1024 * 1024 * params.maxSize}MB`;
  }
}
