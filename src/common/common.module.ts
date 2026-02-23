import { Module } from '@nestjs/common';
import { RoutesLogger } from './logger/router';

@Module({
  providers: [RoutesLogger],
})
export class CommonModule {}
