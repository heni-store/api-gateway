import { Module } from '@nestjs/common';
import { SwaggerService } from '@app/swagger/swagger.service';

@Module({
  providers: [SwaggerService],
  exports: [SwaggerService],
})
export class SwaggerModule {}
