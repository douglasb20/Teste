import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customers } from './entities/customer-entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ErrorBadRequest } from 'CustomErrors/ErrorBadRequest';
import { ErrorNotFound } from 'CustomErrors/ErrorNotFound';

@Injectable()
export class CustomerService {
  private query: QueryRunner;
  constructor(
    @InjectRepository(Customers)
    private customersRepository: Repository<Customers>,
    private dataSource: DataSource
  ) {
    this.query = this.dataSource.createQueryRunner();
  }

  async findAll() {
    return await this.customersRepository.find();
  }

  async findSpecific(customer_code: number,baseUrl: string, measure_type?: string) {

    if (measure_type !== undefined && !['WATER', 'GAS'].includes(measure_type?.toUpperCase())) {
      throw new ErrorBadRequest('INVALID_TYPE', 'Tipo de medição não permitida');
    }

    const customer = await this.customersRepository.findOne({
      where: {
        id: customer_code
      },
      relations: ['measures']
    });

    if (!customer) {
      throw new ErrorNotFound('CUSTOMER_NOT_FOUND', 'Cliente não localizado com código informado');
    }

    const measures = customer.measures
      .filter(measure => !measure_type || measure.measure_type === measure_type.toUpperCase())
      .map(e => ({...e, image_url: `${baseUrl}/images/${e.image_url}`}))

    if (measures.length === 0) {
      throw new ErrorNotFound('MEASURES_NOT_FOUND', 'Nenhuma leitura encontrada');
    }

    customer.measures = measures;

    return {
      customer_code: customer.id,
      measures: measures
    }
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      await this.query.startTransaction();

      const customer = this.customersRepository.create({
        customer_name: createCustomerDto.customer_name
      });

      await this.query.manager.save(Customers, customer);

      await this.query.commitTransaction();
      return customer;
    } catch (err) {
      await this.query.rollbackTransaction();
      throw err;
    }
  }
}
