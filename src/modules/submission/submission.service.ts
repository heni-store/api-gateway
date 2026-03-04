import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { SubmissionRepository } from './submission.repository';
import { SubmissionCreatedEvent, SupportedLanguage } from '@app/libs/contracts';
import { randomUUID } from 'crypto';
import { envConfig } from '@app/config/env.config';

@Injectable()
export class SubmissionService {
  private readonly config = envConfig();
  private readonly clients = new Map<string, ClientProxy>();

  constructor(private readonly repo: SubmissionRepository) {}

  private getQueueForLanguage(language: SupportedLanguage): string {
    if (language === 'javascript' || language === 'typescript') {
      return 'submission.javascript';
    }

    return `submission.${language}`;
  }

  private getClient(queue: string): ClientProxy {
    const existing = this.clients.get(queue);
    if (existing) return existing;

    const client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.config.RMQ_URL],
        queue,
        queueOptions: { durable: true },
      },
    });

    client
      .connect()
      .then(() => console.log(`[LOG]: RMQ client connected (${queue})`))
      .catch((err) =>
        console.error(`[LOG]: RMQ client connect error (${queue})`, err),
      );

    this.clients.set(queue, client);
    return client;
  }

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

    const queue = this.getQueueForLanguage(language);
    const client = this.getClient(queue);
    client.emit(queue, event);

    console.log('[LOG]: submission message is emitted');

    return { submissionId };
  }

  async get(id: string): Promise<any> {
    return this.repo.find(id);
  }
}
