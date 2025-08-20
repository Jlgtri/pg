import * as dotenv from 'dotenv';
import 'source-map-support/register';
dotenv.config();

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import CONFIG from 'config';
import cors from 'cors';

import { CacheCommonService } from '@libs/cache';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { ApiModule } from './api.module';
import { HttpExceptionFilter } from './filters/exception-filter';

export const applyCors = (app: INestApplication): INestApplication => {
  const corsOptions: Parameters<typeof cors>[0] = {
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'x-user',
      'X-Signature',
      'accept',
      'content-type',
      'authorization',
    ],
  };

  app.use(cors(corsOptions));
  // app.setGlobalPrefix('/api');

  return app;
};

async function bootstrap() {
  const app = await NestFactory.create(ApiModule.forRoot());
  applyCors(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(cookieParser());

  app.use(
    session({
      secret: CONFIG.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('pg-backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const logger = new Logger();
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  const cacheCommonService = app.get(CacheCommonService);

  await app
    .listen(CONFIG.SERVICE_SOCKETS.API.PORT)
    .then(() => {
      console.log(
        `API is listening on port ${CONFIG.SERVICE_SOCKETS.API.PORT}`,
      );
      cacheCommonService.clearAllCaches().catch((error) => {
        console.error(error);
      });
    })
    .catch((err) => {
      console.error('Failed to start API:', err);
    });
}
bootstrap().catch(console.error);
