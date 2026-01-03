import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './token.types';
import type { EnvConfig } from '@config/env.config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}

  createAccessToken(payload: JwtPayload): string {
    return this.jwt.sign(payload, { expiresIn: '15m' });
  }

  createRefreshToken(payload: JwtPayload): string {
    const refreshSecret = this.configService.get('JWT_REFRESH_SECRET', {
      infer: true,
    });
    return this.jwt.sign(payload, {
      expiresIn: '7d',
      secret: refreshSecret,
    });
  }
}
