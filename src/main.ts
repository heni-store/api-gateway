import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { envConfig } from '@config/env.config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerService } from '@app/swagger/swagger.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = envConfig();
  const logger = new Logger();

  const swaggerService = app.get(SwaggerService);

  app.enableCors({
    origin: config.CORS.ORIGIN,
    credentials: config.CORS.CREDENTIALS,
  });

  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: config.PIPE_OPTIONS.WHITE_LIST,
      forbidNonWhitelisted: config.PIPE_OPTIONS.FORBID_NON_WHITE_LISTED,
    }),
  );

  app.setGlobalPrefix(config.SERVICE_GLOBAL_PREFIX);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.RMQ_URL],
      queue: 'submission.finished',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  swaggerService.setup(app);

  await app.startAllMicroservices();
  await app.listen(config.PORT);

  logger.log(`🔥 Server listening port:${config.PORT}`);
  logger.log(` Swagger: http://localhost:${config.PORT}/api`);
}
void bootstrap();
