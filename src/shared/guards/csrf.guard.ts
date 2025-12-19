import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { AuthRequest } from '../../modules/auth/types';
import { CSRF_HEADER } from '../constants';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();

    if (
      req.method === 'GET' ||
      req.method === 'HEAD' ||
      req.method === 'OPTIONS'
    ) {
      return true;
    }

    const csrfCookie = req.cookies.csrf_token;
    const csrfHeader = req.headers[CSRF_HEADER];

    if (
      typeof csrfCookie !== 'string' ||
      typeof csrfHeader !== 'string' ||
      csrfCookie !== csrfHeader
    ) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
