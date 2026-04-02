import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '@modules/dashboard/auth/dto/login.dto';
import { AuthResponseDto } from '@modules/dashboard/auth/dto/auth-response.dto';
import { RedisService } from '@modules/redis/redis.service';
import { AdminRole } from '@prisma/client';

interface JwtPayload {
  sub: string;
  login: string;
  role: AdminRole;
  exp: number;
  iat: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private redis: RedisService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.adminUser.findUnique({
      where: { login: dto.login },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = this.jwt.sign({
      sub: user.id,
      login: user.login,
      role: user.role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        role: user.role,
      },
    };
  }

  async logout(token: string): Promise<void> {
    const decoded = await this.jwt
      .verifyAsync<JwtPayload>(token, { ignoreExpiration: true })
      .catch(() => null);

    if (!decoded) {
      throw new UnauthorizedException('Не валидный токен');
    }

    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    await this.redis.set(`blacklist:${token}`, '1', ttl > 0 ? ttl : 60);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.redis.exists(`blacklist:${token}`);
  }
}
