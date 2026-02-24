import { Controller } from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { SubmissionFinishedEvent } from '@app/libs/contracts/indext';

@Controller()
export class SubmissionListener {
  constructor(private readonly repo: SubmissionRepository) {}

  @EventPattern('submission.finished')
  async handleFinished(@Payload() event: SubmissionFinishedEvent) {
    await this.repo.update(event);
  }
}
