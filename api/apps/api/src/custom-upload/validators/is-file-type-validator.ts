import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as path from 'path';

import { CustomUpload } from '../model/upload';

type ValidatorParams = { validTypes: string[] };

@Injectable()
@ValidatorConstraint({ async: true })
export class IsFileType implements ValidatorConstraintInterface {
  static params(params: ValidatorParams) {
    return [params];
  }

  async validate(
    value: Promise<CustomUpload>,
    validatorArguments: ValidationArguments,
  ) {
    const [params] = validatorArguments.constraints as ValidatorParams[];
    const file = await value;

    // remove first character '.' from ext part name
    const ext = path.extname(file.filename?.toLowerCase() ?? '').slice(1);
    const validTypes = params.validTypes;

    return validTypes.includes(ext);
  }
  defaultMessage(validatorArguments: ValidationArguments) {
    const [params] = validatorArguments.constraints as ValidatorParams[];
    return `File must be a type: ${params.validTypes.join(', ')}`;
  }
}
