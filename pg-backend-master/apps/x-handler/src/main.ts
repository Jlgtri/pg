import 'source-map-support/register';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { TCP_CONFIG } from './constants';
import { XHandlerModule } from './x-handler.module';

async function bootstrap() {
  const Module = XHandlerModule.forRoot();
  const app = await NestFactory.createMicroservice(Module, TCP_CONFIG);
  await app.listen();
}
bootstrap();
