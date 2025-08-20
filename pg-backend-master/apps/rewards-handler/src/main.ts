import 'source-map-support/register';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { RewardsHandlerModule } from './rewards-handler.module';
import { TCP_CONFIG } from './constants';

async function bootstrap() {
  const Module = RewardsHandlerModule.forRoot();
  const app = await NestFactory.createMicroservice(Module, TCP_CONFIG);
  await app.listen();
}
bootstrap().catch(console.error);
