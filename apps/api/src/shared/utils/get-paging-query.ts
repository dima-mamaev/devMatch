import { PagingInput } from '../inputs/paging.input';

export function getPagingQuery(paging: PagingInput) {
  const page = paging.page ?? 1;
  const limit = paging.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
