import 'dotenv/config';
import { CreateCustomerTable1727729764902 } from 'migrations/1727729764902-CreateCustomerTable';
import { CreateMeasuresTable1727729778624 } from 'migrations/1727729778624-CreateMeasuresTable';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'sysmeter-db',
  port: 3306,
  username: 'sysmeter',
  password: 'Lh;G&!mTuz',
  database: 'sysmeterdb',
  entities: [],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  migrations: [CreateCustomerTable1727729764902, CreateMeasuresTable1727729778624],
});
