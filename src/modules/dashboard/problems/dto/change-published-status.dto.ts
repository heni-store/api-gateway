import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePublishedStatusDto {
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsBoolean()
  value: boolean;
}
