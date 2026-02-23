import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { envConfig } from '@config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = envConfig();
  const logger = new Logger();

  app.enableCors({
    origin: config.CORS.ORIGIN,
    credentials: config.CORS.CREDENTIALS,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: config.PIPE_OPTIONS.WHITE_LIST,
      forbidNonWhitelisted: config.PIPE_OPTIONS.FORBID_NON_WHITE_LISTED,
    }),
  );

  app.setGlobalPrefix(config.SERVICE_GLOBAL_PREFIX);

  await app.listen(config.PORT);

  logger.log(`🔥 Server listening port:${config.PORT}`);
}
void bootstrap();
