import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

type ValidatorParams = { relatedField: string };

@Injectable()
@ValidatorConstraint()
export class ShouldBeEqualValidator implements ValidatorConstraintInterface {
  static params(params: ValidatorParams) {
    return [params];
  }

  validate(value: string, { constraints, object }: ValidationArguments) {
    const [{ relatedField }] = constraints as ValidatorParams[];
    if (Object.hasOwnProperty.call(object, relatedField)) {
      const relatedValue = (object as Record<string, unknown>)[relatedField];
      return value === relatedValue;
    }
    return false;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}
