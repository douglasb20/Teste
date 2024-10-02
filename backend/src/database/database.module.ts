import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'sysmeter-db',
      port: 3306,
      username: 'sysmeter',
      password: 'Lh;G&!mTuz',
      database: 'sysmeterdb',
      autoLoadEntities: true,
      synchronize: false,
      dateStrings: true,
    }),
  ],
})
export class DatabaseModule { }
