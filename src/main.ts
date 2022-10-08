import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { PORT } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes( new ValidationPipe({forbidNonWhitelisted: true, whitelist: true,}));
  await app.listen(PORT);
}
bootstrap();