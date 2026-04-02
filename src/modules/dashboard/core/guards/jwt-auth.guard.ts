import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@modules/dashboard/auth/auth.service';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private auth: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    const isBlacklisted = await this.auth.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Токен отозван');
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
