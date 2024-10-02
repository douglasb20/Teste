import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { CustomValidationPipe } from 'CustomErrors/CustomValidationPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  // app.setGlobalPrefix('api');

  // Configurar o body-parser
  app.use(bodyParser.json({ limit: '10mb' })); // Tamanho máximo para JSON
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Tamanho máximo para URL-encoded

  app.enableCors({
    origin: '*',
  });
  await app.listen(3001);
}
bootstrap();
