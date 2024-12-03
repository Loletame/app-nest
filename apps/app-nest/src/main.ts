import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors')

  app.enableCors();
  app.use(cors({
         origin: 'http://localhost:8100', // Allow requests from this origin
         methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
         allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
     }));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    transformOptions: { enableImplicitConversion: true},
  }),
);
  

  await app.listen(envs.port);
}
bootstrap();
