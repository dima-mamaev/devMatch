import { registerEnumType } from '@nestjs/graphql';

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(Sort, {
  name: 'Sort',
  description: 'Sort',
});
