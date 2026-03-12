import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ContextWithUser } from '../../../../../types/types';
import { User } from '../../user/models/user.entity';

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlExecutionContext = GqlExecutionContext.create(ctx);
    const context = gqlExecutionContext.getContext<ContextWithUser>();
    return context.req?.user as User;
  },
);
