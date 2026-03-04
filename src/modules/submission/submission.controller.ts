import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SupportedLanguage } from '@app/libs/contracts';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}

  @Post()
  create(
    @Body()
    body: {
      language: SupportedLanguage;
      sourceCode: string;
      inputCode?: string;
    },
  ) {
    return this.service.create(body.language, body.sourceCode, body.inputCode);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }
}
