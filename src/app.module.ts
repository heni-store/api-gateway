import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { envConfig } from '@config/env.config';
import { PrismaModule } from '@modules/prisma/prisma.module';

import { ROUTES } from '@common/constants/routes';

import { CommonModule } from '@common/common.module';
import { SubmissionModule } from '@modules/submission/submission.module';
import { ProblemsModule } from '@modules/problems/problems.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';
import { RedisModule } from '@modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    PrismaModule,
    RedisModule,

    CommonModule,

    SubmissionModule,
    ProblemsModule,
    DashboardModule,

    RouterModule.register([
      {
        path: ROUTES.DASHBOARD,
        module: DashboardModule,
      },
    ]),
  ],
})
export class AppModule {}
