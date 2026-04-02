import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@modules/prisma/prisma.service';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return (req.cookies?.access_token as string | undefined) ?? null;
      },
      secretOrKey: config.get('JWT_SECRET') || 'default-key',
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; login: string; role: string }) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      login: user.login,
      name: user.name,
      role: user.role,
    };
  }
}
