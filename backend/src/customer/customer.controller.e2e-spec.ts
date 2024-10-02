import 'dotenv/config'
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'

import { CustomerController } from './customer.controller';
import { Customers } from './entities/customer-entity';
import { Measures } from 'measures/entities/measures-entity';
import { MeasuresModule } from 'measures/measures.module';
import { CustomerModule } from './customer.module';
import { ConfigModule } from '@nestjs/config';

describe('CustomerController e2e tests', () => {
  let controller: CustomerController;
  let module: TestingModule;
  let data: any;
  let customers: Customers[];
  let app: INestApplication<any>;

  const dataSourceTest: DataSourceOptions = {
    type: 'mysql',
    host: 'sysmeterTest-db',
    port: 3306,
    username: 'sysmeterTest',
    password: 'T9S5Ek3dBxd%',
    database: 'sysmeterTestdb',
    entities: [Customers, Measures],
    synchronize: false,
    timezone: 'local'
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => dataSourceTest
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CustomerModule,
        MeasuresModule,
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init()

    data = {
      customer_name: 'Pedro Alvares Cabral'
    }
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    const repository = dataSource.getRepository(Customers);
    customers = await repository.find();

    await dataSource.destroy();
  })

  afterAll(async () => {
    await module.close();
  })

  describe('POST /customers', () => {
    it('should create a customer', async () => {
      const res = await request(app.getHttpServer())
        .post('/customers')
        .send(data)
        .expect(201);
      console.log(res.body);
      expect(res.body.id).toBeDefined()
      expect(res.body.costumer_uuid).toBeDefined()
      expect(res.body.customer_name).toEqual(data.customer_name)
      expect(res.body.created_at).toBeDefined()
      expect(res.body.updated_at).toBeDefined()
      expect(res.body.status).toEqual(1)
    })
  })

  describe('GET /customers', () => {
    it('should list all customers', async () => {
      const res = await request(app.getHttpServer())
        .get('/customers')
        .expect(200);
      
      expect(res.body[0].id).toEqual(1)
      expect(res.body[0].costumer_uuid).toEqual('a164c203-3767-45ff-904e-1e885e2e523c')
      expect(res.body[0].customer_name).toEqual("Douglas A. Silva")
      expect(res.body[0].created_at).toBeDefined()
      expect(res.body[0].updated_at).toBeDefined()
      expect(res.body[0].status).toEqual(1)

    })
  })
});
