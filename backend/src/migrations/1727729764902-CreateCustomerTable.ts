import { MigrationInterface, QueryRunner, Table } from "typeorm";
import {v4 as uuidv4 } from 'uuid'

export class CreateCustomerTable1727729764902 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'costumer_uuid',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'customer_name',
            type: 'varchar',
            length: '90',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
            default: 'NULL default NULL ON UPDATE CURRENT_TIMESTAMP'
          },
          {
            name: 'status',
            type: 'tinyint',
            length: '1',
            default: '1',
          },
        ],
      }),
      true,
    );
    await queryRunner.query(
      `INSERT INTO \
            customers(costumer_uuid, customer_name) \
            values('${uuidv4()}', "Douglas A. Silva")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('customers');
  }

}
