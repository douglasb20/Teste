import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { CustomValidationPipe } from 'CustomErrors/CustomValidationPipe';
import * as fs from 'fs';
import * as path from 'path';

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

  // Criando a pasta files para receber as imagens de leitura
  const destPath = path.join(__dirname, '..', '..', 'files', 'images');
  if (!fs.existsSync(destPath)) {
    await fs.promises.mkdir(destPath, { recursive: true });
  }
  await app.listen(3001);
}
bootstrap();
