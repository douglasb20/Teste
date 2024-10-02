import { Customers } from 'customer/entities/customer-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Measures {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'customer_id', type: 'bigint' })
  customer_id: number;

  @Column({ name: 'measure_uuid', type: 'varchar' })
  measure_uuid: string;

  @CreateDateColumn({ name: 'measure_datetime', type: 'timestamp' })
  measure_datetime: Date;

  @Column({ name: 'measure_value', type: 'int' })
  measure_value: number;

  @Column({ name: 'measure_type', type: 'varchar' })
  measure_type: string;

  @Column({ name: 'has_confirmed', type: 'tinyint', default: 0 })
  has_confirmed: number;

  @Column({ name: 'image_url', type: 'varchar' })
  image_url: string;

  @ManyToOne(() => Customers, (customers) => customers.measures)
  @JoinColumn({ name: 'customer_id' })
  customers: Customers;
}
