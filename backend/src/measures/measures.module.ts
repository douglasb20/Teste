import { Module } from '@nestjs/common';
import { MeasuresService } from './measures.service';
import { MeasuresController } from './measures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measures } from './entities/measures-entity';
import { Customers } from 'customer/entities/customer-entity';

@Module({
  imports: [TypeOrmModule.forFeature([Measures, Customers])],
  controllers: [MeasuresController],
  providers: [MeasuresService],
})
export class MeasuresModule {}
