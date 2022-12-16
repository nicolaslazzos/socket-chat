import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    // remove non specified fields from the request body
    whitelist: true,
    // throws an exception if a non specified field is sent in the request body
    forbidNonWhitelisted: true,
    // transforms the request body to an instance of its dto and parameters to its types
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  await app.listen(3000);
}
bootstrap();
