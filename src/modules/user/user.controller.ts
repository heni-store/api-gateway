import { Controller, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../auth/jwt/current-user.decorator';
import type { JwtPayload } from '../auth/tokens/token.types';
import { UsersService } from '../users/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getInfo(@CurrentUser() user: JwtPayload) {
    return this.usersService.findByEmail(user.email);
  }
}
