import { Module } from '@nestjs/common';
import { AuthService } from '@modules/dashboard/auth/auth.service';
import { AuthController } from '@modules/dashboard/auth/auth.controller';
import { JwtStrategy } from '@modules/dashboard/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '@modules/dashboard/core/guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'default-key',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
