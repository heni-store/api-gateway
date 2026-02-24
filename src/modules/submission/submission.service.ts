import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubmissionRepository } from './submission.repository';
import {
  SubmissionCreatedEvent,
  SupportedLanguage,
} from '@app/libs/contracts/indext';
import { randomUUID } from 'crypto';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject('RMQ_CLIENT') private readonly client: ClientProxy,
    private readonly repo: SubmissionRepository,
  ) {}

  async create(
    language: SupportedLanguage,
    sourceCode: string,
    input?: string,
  ) {
    const submissionId = randomUUID();
    await this.repo.create(submissionId);

    const event: SubmissionCreatedEvent = {
      submissionId,
      language,
      sourceCode,
      input,
    };

    this.client.emit(`submission.${language}`, event);

    return { submissionId };
  }

  async get(id: string): Promise<any> {
    return this.repo.find(id);
  }
}
