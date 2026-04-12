import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Difficulty } from '@prisma/client';
import { TranslationDto } from '@modules/dashboard/problems/dto/translation.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProblemDto {
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
