import {
  ArgumentMetadata,
  PipeTransform,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GenerateGroupInterface } from '../../../../../types/types';

export class CustomValidationPipe implements PipeTransform {
  private readonly skipTypes = [
    String,
    Boolean,
    Number,
    Array,
    Object,
    Promise,
  ];

  constructor(private readonly options?: ValidationPipeOptions) {}

  private shouldSkipTransform(metatype: unknown): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const type = metatype as any;
    return (
      this.skipTypes.includes(type) ||
      type.name === 'Promise' ||
      type.name === 'Object'
    );
  }

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    const { metatype } = metadata;

    if (!metatype || this.shouldSkipTransform(metatype)) {
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
