import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubmissionController } from './submission.controller';
import { SubmissionListener } from './submission.listener';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URl ?? 'amqp://localhost:5672'],
          exchange: 'submissions',
          queue: 'gateway_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [SubmissionController, SubmissionListener],
  providers: [SubmissionService, SubmissionRepository],
})
export class SubmissionModule {}
