import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRequest } from '../types/auth-request.types';
import { JwtPayload } from '../tokens/token.types';
import type { EnvConfig } from '../../../config/env.config';

function cookieExtractor(req: AuthRequest): string | null {
  return req.cookies?.access_token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService<EnvConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: configService.get('JWT_SECRET', { infer: true }),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
