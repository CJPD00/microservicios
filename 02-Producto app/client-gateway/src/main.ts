import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {

  const logger =new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(envs.port);

  logger.log(`Client Gateway running on port ${envs.port}`);
}
void bootstrap();
