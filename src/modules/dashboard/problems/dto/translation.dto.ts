import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Locale } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TranslationDto {
  @ApiProperty()
  @IsEnum(Locale)
  locale: Locale;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  examples?: any;

  @ApiProperty()
  @IsOptional()
  constraints?: any;

  @ApiProperty()
  @IsOptional()
  starterCode?: any;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
