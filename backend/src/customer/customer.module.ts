import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from './entities/customer-entity';
import { Measures } from 'measures/entities/measures-entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customers])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
