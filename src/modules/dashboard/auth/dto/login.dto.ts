import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Минимум 6 символов' })
  password: string;
}
