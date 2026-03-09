import {
  ArgumentMetadata,
  PipeTransform,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GenerateGroupInterface } from '../../../../../types/types';

export class CustomValidationPipe implements PipeTransform {
  constructor(private readonly options?: ValidationPipeOptions) {}

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    const { metatype } = metadata;

    if (!metatype || metatype === Promise || metatype.name === 'Promise') {
      return value;
    }

    const instance = plainToInstance<unknown, unknown>(metatype, value);
    let groups: string[] = [];

    if (
      typeof (instance as GenerateGroupInterface)?.generateGroups === 'function'
    ) {
      groups = (instance as GenerateGroupInterface).generateGroups();
    }

    const validationPipe = new ValidationPipe({
      ...this.options,
      groups,
    });

    return validationPipe.transform(value, metadata);
  }
}
