import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/dashboard/auth/auth.module';
import { ProblemsModule } from '@modules/dashboard/problems/problems.module';

@Module({
  imports: [AuthModule, ProblemsModule],
})
export class DashboardModule {}
