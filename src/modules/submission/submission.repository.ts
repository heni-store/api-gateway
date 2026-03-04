import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { envConfig } from '@app/config/env.config';
import { SubmissionFinishedEvent } from '@app/libs/contracts';

@Injectable()
export class SubmissionRepository {
  private readonly config = envConfig();

  private readonly redis = new Redis(this.config.REDIS.URL);

  async create(id: string) {
    await this.redis.set(
      `submission:${id}`,
      JSON.stringify({ status: 'PENDING' }),
      'EX',
      600,
    );
  }

  async update(event: SubmissionFinishedEvent) {
    await this.redis.set(
      `submission:${event.submissionId}`,
      JSON.stringify(event),
      'EX',
      600,
    );
  }

  async find(id: string): Promise<any> {
    const data = await this.redis.get(`submission:${id}`);
    return data ? JSON.parse(data) : null;
  }
}
