import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const cronService = app.get(CronjobService);
  // cronService.startCronJob();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: 'https://zorder.site',
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(3003);
}
bootstrap();
