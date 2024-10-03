import { TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { Customers } from './entities/customer-entity';
import { Measures } from 'measures/entities/measures-entity';
import { MeasuresModule } from 'measures/measures.module';
import { CustomerModule } from './customer.module';
import { AppWithModule, createTestingApp } from 'Utils/createTestingApp';

describe('CustomerController e2e tests', () => {
  let module: TestingModule;
  let data: any;
  let app: INestApplication<any>;
  let dataSource: DataSource;
  let testingApp: AppWithModule; 
  
  beforeAll(async () => {
    // Componente onde configuro a inicialização do app
    testingApp = await createTestingApp({entities: [Customers, Measures], modules: [CustomerModule, MeasuresModule]})
    module = testingApp.module
    app = testingApp.app;
    dataSource = module.get<DataSource>(DataSource);

    data = {
      customer_name: 'Pedro Alvares Cabral',
    };
  });

  afterAll(async () => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.query('DELETE FROM customers');
    await queryRunner.release();
    await dataSource.destroy();
    await module.close();
    await app.close();
  });

  describe('POST /customers', () => {
    it('should create a customer', async () => {
      const res = await request(app.getHttpServer()).post('/customers').send(data).expect(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.costumer_uuid).toBeDefined();
      expect(res.body.customer_name).toEqual(data.customer_name);
      expect(res.body.created_at).toBeDefined();
      expect(res.body.updated_at).toBeDefined();
      expect(res.body.status).toEqual(1);
    });

    it('should return status 400 bad request', async () => {
      await request(app.getHttpServer()).post('/customers').expect(400);
    });
  });

  describe('GET /customers', () => {
    it('should list all customers', async () => {
      const res = await request(app.getHttpServer()).get('/customers').expect(200);

      expect(res.body[0].id).toBeDefined();
      expect(res.body[0].costumer_uuid).toBeDefined();
      expect(res.body[0].customer_name).toEqual(data.customer_name);
      expect(res.body[0].created_at).toBeDefined();
      expect(res.body[0].updated_at).toBeDefined();
      expect(res.body[0].status).toEqual(1);
    });
  });
});
