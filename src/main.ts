import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CronjobService } from './cronjob/cronjob.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cronService = app.get(CronjobService);
  
  cronService.startCronJob()
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
