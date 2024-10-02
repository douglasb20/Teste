import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Request } from 'express';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }


  @Get('customers')
  async findAll() {
    return this.customerService.findAll();
  }
  @Get(':customer_code/list')
  @HttpCode(HttpStatus.OK)
  async findSpecific(
    @Param('customer_code') customer_code: string,
    @Req() req: Request,
    @Query('measure_type') measure_type?: string,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.customerService.findSpecific(Number(customer_code),baseUrl,  measure_type);
  }

  @Post('customers')
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }
}
