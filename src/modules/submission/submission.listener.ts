import { Controller } from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import type { SubmissionFinishedEvent } from '@app/libs/contracts';

@Controller()
export class SubmissionListener {
  constructor(private readonly repo: SubmissionRepository) {}

  @EventPattern('submission.finished')
  async handleFinished(
    @Payload() event: SubmissionFinishedEvent,
    @Ctx() context: RmqContext,
  ) {
    try {
      console.log('[LOG]: submission.finished received', event?.submissionId);
      await this.repo.update(event);
    } finally {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    }
  }
}
