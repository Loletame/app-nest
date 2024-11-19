import { NestFactory } from '@nestjs/core';
import { MailerServiceModule } from './mailer-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from 'apps/app-nest/src/configs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MailerServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.ms_port,
        host: envs.ms_host,

      },
    },
  );
  await app.listen();
}
bootstrap();
