import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from '@config/env.config';
import { PrismaModule } from '@modules/prisma/prisma.module';

import { ProblemsModule } from './modules/problems/problems.module';
import { CommonModule } from './common/common.module';
import { SubmissionModule } from './modules/submission/submission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    PrismaModule,

    CommonModule,
    SubmissionModule,

    ProblemsModule,
  ],
})
export class AppModule {}
