import { Measures } from "measures/entities/measures-entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity()
export class Customers{

  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Column({ length: 36 })
  costumer_uuid: string;
  
  @Column({ length: 90 })
  customer_name: string;
  
  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  created_at: Date;
  
  @CreateDateColumn({ type: 'timestamp', precision:0, default:  null , onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 1, nullable: true })
  status: number;

  @OneToMany(() => Measures, (measures) => measures.customers)
  measures: Measures[]

  @BeforeInsert()
  save() {
    this.costumer_uuid = uuidV4();
  }

}