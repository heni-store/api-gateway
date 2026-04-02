import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@modules/dashboard/auth/auth.service';
import { LoginDto } from '@modules/dashboard/auth/dto/login.dto';
import { AuthResponseDto } from '@modules/dashboard/auth/dto/auth-response.dto';
import { JwtAuthGuard } from '@modules/dashboard/core/guards/jwt-auth.guard';
import { CurrentUser } from '@modules/dashboard/core/decorators/current-user.decorator';
import type { CookieOptions, Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  private getCookieOptions(): CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';
    const sameSite: CookieOptions['sameSite'] = isProd ? 'none' : 'lax';

    return {
      httpOnly: true,
      secure: isProd,
      sameSite,
      path: '/',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponseDto, 'accessToken'>> {
    const { accessToken, user } = await this.auth.login(dto);

    res.cookie('access_token', accessToken, this.getCookieOptions());

    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const token = req.cookies?.access_token as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    await this.auth.logout(token);
    res.clearCookie('access_token', this.getCookieOptions());

    return { message: 'Выход выполнен' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: unknown): unknown {
    return user;
  }
}
