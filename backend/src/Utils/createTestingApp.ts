import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DynamicModule, ForwardReference, INestApplication, Type } from '@nestjs/common';
import { DataSourceOptions, EntitySchema, MixedList } from 'typeorm';

import { CustomValidationPipe } from 'CustomErrors/CustomValidationPipe';  // Supondo que o pipe está aqui

// Define a interface para o retorno com app e module
export interface AppWithModule {
  app: INestApplication;
  module: TestingModule;
}

interface CreatingTestingAppProps {
  entities?: MixedList<string | Function | EntitySchema<any>>;
  modules?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>
}

export async function createTestingApp(props?: CreatingTestingAppProps): Promise<AppWithModule> {

  const { entities, modules} = props;

  const dataSourceTest: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3310,
    username: 'sysmeterTest',
    password: 'T9S5Ek3dBxd%',
    database: 'sysmeterTestdb',
    entities: entities,
    synchronize: false,
    timezone: 'local',
  };
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRootAsync({
        useFactory: async () => dataSourceTest,
      }),
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      ...modules
    ],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new CustomValidationPipe());
  await app.init();
  
  return {app, module};
}
