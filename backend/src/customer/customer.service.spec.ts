import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Measures } from 'measures/entities/measures-entity';
import { Repository, DataSource, DataSourceOptions } from 'typeorm';
import { Customers } from './entities/customer-entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ErrorBadRequest } from 'CustomErrors/ErrorBadRequest';
import { ErrorNotFound } from 'CustomErrors/ErrorNotFound';
import { v4 as uuidV4 } from 'uuid';

describe('CustomerService', () => {
  let module: TestingModule;
  let service: CustomerService;
  let customerRepository: Repository<Customers>;
  let measureRepository: Repository<Measures>;
  let dataSource: DataSource;
  const baseUrl = 'http://localhost:3001';

  const dataSourceTest: DataSourceOptions = {
    type: 'mysql',
    host: 'sysmeterTest-db',
    port: 3306,
    username: 'sysmeterTest',
    password: 'T9S5Ek3dBxd%',
    database: 'sysmeterTestdb',
    entities: [Customers, Measures],
    synchronize: false,
    timezone: 'local',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [CustomerService],
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => dataSourceTest,
        }),
        TypeOrmModule.forFeature([Customers, Measures]),
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<Repository<Customers>>(getRepositoryToken(Customers));
    measureRepository = module.get<Repository<Measures>>(getRepositoryToken(Measures));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.query('DELETE FROM measures');
    await queryRunner.query('DELETE FROM customers');
    await queryRunner.release();
  });

  afterAll(async () => {
    // Encerrar a conexão após todos os testes.
    await dataSource.destroy();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findSpecific', () => {
    it('should throw ErrorBadRequest if measure_type is invalid', async () => {
      await expect(service.findSpecific(1, baseUrl, 'INVALID')).rejects.toThrow(ErrorBadRequest);
    });

    it('should throw ErrorNotFound if customer is not found', async () => {
      await expect(service.findSpecific(999, baseUrl)).rejects.toThrow(ErrorNotFound);
    });

    it('should throw ErrorNotFound if no measures are found', async () => {
      await customerRepository.save({
        id: 1,
        costumer_uuid: uuidV4(),
        customer_name: 'Teste Customer',
      });
      await expect(service.findSpecific(1, baseUrl)).rejects.toThrow(ErrorNotFound);
    });

    it('should return customer with measures when customer and measures are found', async () => {
      const newCustomer = await customerRepository.save({
        id: 1,
        costumer_uuid: uuidV4(),
        customer_name: 'Teste Customer',
      });
      const measure_uuid = uuidV4();
      const dataMeasure = {
        measure_uuid,
        image_url: `meter_${measure_uuid}.jpg`,
        customers: newCustomer,
        measure_datetime: '2024-09-15 16:00:00',
        measure_value: 15684,
        measure_type: 'WATER',
      };
      const newMeasure = await measureRepository.save(dataMeasure);
      delete newMeasure.customers;
      const result = await service.findSpecific(1, baseUrl, 'WATER');
      expect(result).toEqual({
        customer_code: newCustomer.id,
        measures: [newMeasure],
      });
    });

    it('should return customer with measures only with customer_code', async () => {
      const newCustomer = await customerRepository.save({
        id: 1,
        costumer_uuid: uuidV4(),
        customer_name: 'Teste Customer',
      });
      const measure_uuid = uuidV4();
      const dataMeasure = {
        measure_uuid,
        image_url: `meter_${measure_uuid}.jpg`,
        customers: newCustomer,
        measure_datetime: '2024-09-15 16:00:00',
        measure_value: 15684,
        measure_type: 'WATER',
      };
      const newMeasure = await measureRepository.save(dataMeasure);
      delete newMeasure.customers;
      const result = await service.findSpecific(1, baseUrl);
      expect(result).toEqual({
        customer_code: newCustomer.id,
        measures: [newMeasure],
      });
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const newCustomer = { customer_name: 'Teste Customer' };
      const result = await service.createCustomer(newCustomer);
      expect(result.customer_name).toEqual(newCustomer.customer_name);
      expect(result.id).toBeDefined();
      expect(result.status).toEqual(1);
    });
  });
});
