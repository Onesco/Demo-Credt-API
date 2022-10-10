import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { PORT } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes( 
    new ValidationPipe({
      forbidNonWhitelisted: true, 
      whitelist: true,
    })
  );
  const config = new DocumentBuilder()
    .setTitle('Demo Credit')
    .setDescription('The Demo Credit lending API')
    .setVersion('1.0')
    .addTag('demo Credit API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap();