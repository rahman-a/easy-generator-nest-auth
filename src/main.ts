import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { corsOptions } from './config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
