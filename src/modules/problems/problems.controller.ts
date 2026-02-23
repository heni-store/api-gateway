import {
  Controller,
  DefaultValuePipe,
  Query,
  Get,
  Param,
  ParseEnumPipe,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { Locale } from '@prisma/client';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  findAll(
    @Query('locale', new DefaultValuePipe(Locale.RU), new ParseEnumPipe(Locale))
    locale: Locale,
  ) {
    return this.problemsService.findAll(locale);
  }

  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
    @Query('locale', new DefaultValuePipe(Locale.RU), new ParseEnumPipe(Locale))
    locale: Locale,
  ) {
    return this.problemsService.findBySlug(slug, locale);
  }
}
