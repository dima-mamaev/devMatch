import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ContextWithUser } from '../../../../../types/types';

export const GqlHeaders = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const headers = gqlCtx.getContext<ContextWithUser>().req.headers;
    return data ? headers[data] : headers;
  },
);
