import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(6, { message: 'Минимум 6 символов' })
  password: string;
}
