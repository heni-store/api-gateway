import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/user.service';
import { TokenService } from './tokens/token.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from './tokens/token.types';
import type { EnvConfig } from '../../config/env.config';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}

  async register(email: string, password: string): Promise<void> {
    const existing = await this.usersService.findByEmail(email);

    if (existing) {
      throw new ConflictException('Email already in user');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.usersService.create(email, passwordHash);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('invalid creditionals');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('invalid creditionals');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: this.tokenService.createAccessToken(payload),
      refreshToken: this.tokenService.createRefreshToken(payload),
    };
  }

  refresh(refreshToken: string): { accessToken: string } {
    let payload: JwtPayload;
    const refreshSecret = this.configService.get('JWT_REFRESH_SECRET', {
      infer: true,
    });

    try {
      payload = this.jwt.verify<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
      },
      { expiresIn: '15m' },
    );

    return { accessToken };
  }
}
