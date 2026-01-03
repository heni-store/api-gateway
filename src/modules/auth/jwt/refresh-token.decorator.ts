import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REFRESH_TOKEN_COOKIE } from '@shared/constants';

export const RefreshToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | null => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE];

    return typeof token === 'string' ? token : null;
  },
);
