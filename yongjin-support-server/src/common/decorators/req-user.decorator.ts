import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 요청 객체에서 사용자 정보 가져오는 Decorator
 */
export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
