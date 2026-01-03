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
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(config.PORT);

  logger.log(`🔥 Server listening port:${config.PORT}`);
}
void bootstrap();
