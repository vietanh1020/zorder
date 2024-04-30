import { JwtDecoded } from '@/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtUser = createParamDecorator(
  (key: keyof JwtDecoded, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtDecoded;
    return key ? user?.[key] : user;
  },
);
