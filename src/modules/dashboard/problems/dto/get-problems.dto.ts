import { Difficulty } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetProblemsDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPublished?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 100;
}
