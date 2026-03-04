import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionListener } from './submission.listener';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';

@Module({
  controllers: [SubmissionController, SubmissionListener],
  providers: [SubmissionService, SubmissionRepository],
})
export class SubmissionModule {}
