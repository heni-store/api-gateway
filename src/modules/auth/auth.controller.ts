import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CurrentUser } from './jwt/current-user.decorator';
import { RegisterDto, LoginDto } from './dto';
import express from 'express';
import type { JwtPayload } from './tokens/token.types';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  CSRF_COOKIE,
} from '@shared/constants';
import { generateCsrfToken } from '@shared/utils';
import { CsrfGuard } from '@shared/guards';
import type { AuthRequest } from './types';
import type { EnvConfig } from '@config/env.config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<{ ok: true }> {
    await this.authService.register(dto.email, dto.password);
    return { ok: true };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      dto.email,
      dto.password,
    );

    const csrfToken = generateCsrfToken();

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(CSRF_COOKIE, csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'strict',
    });

    return {
      ok: true,
    };
  }

  @UseGuards(CsrfGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
    return { ok: true };
  }

  @Post('refresh')
  refresh(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: express.Response,
  ): { ok: true } {
    const refreshToken = req.cookies?.refresh_token;

    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('No refresh token');
    }

    const { accessToken } = this.authService.refresh(refreshToken);

    const csrfToken = generateCsrfToken();
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(CSRF_COOKIE, csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'strict',
    });

    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload): JwtPayload {
    return user;
  }
}
