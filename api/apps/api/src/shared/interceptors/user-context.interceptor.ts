import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AppClsStore, ContextWithUser } from '../../../../../types/types';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService<AppClsStore>) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const context =
      GqlExecutionContext.create(ctx).getContext<ContextWithUser>();
    if (context.req?.user) {
      this.cls.set('user', context.req.user);
    }
    return next.handle();
  }
}
