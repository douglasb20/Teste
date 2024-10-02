import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

import { DatabaseModule } from './database/database.module';
import { CustomerModule } from './customer/customer.module';
import { MeasuresModule } from './measures/measures.module';
import { ServeStaticModule } from '@nestjs/serve-static';

const destPath = path.join(__dirname, '..', '/files');
@Global()
@Module({
  imports: [
    MulterModule.register({
      dest: destPath,
      limits: { fileSize: 1024 * 1024 * 10 /* 10mb */ },
      storage: diskStorage({
        filename(_, file, callback) {
          const extension = file.mimetype.split('/')[1];
          const fileName = `fileUploaded_${Date.now()}.${extension}`;
          callback(null, fileName);
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'files', 'images'),
      serveRoot: '/images',
    }),
    DatabaseModule,
    CustomerModule,
    MeasuresModule,
  ],
  exports: [MulterModule],
})
export class AppModule {}
