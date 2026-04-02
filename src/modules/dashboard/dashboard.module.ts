import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/dashboard/auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class DashboardModule {}
