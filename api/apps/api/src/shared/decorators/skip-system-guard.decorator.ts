import { Reflector } from '@nestjs/core';

export const SkipSystemGuard = Reflector.createDecorator<boolean>();
