import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateMeasuresTable1727729778624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'measures',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'customer_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'measure_uuid',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'measure_type',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'measure_type',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'measure_datetime',
            type: 'datetime',
            isNullable: false,
          },
          {
            name: 'has_confirmed',
            type: 'tinyint',
            length: '1',
            isNullable: true,
            default: '0',
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '90',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'measures',
      new TableIndex({
        name: 'customer_id_fk_idx',
        columnNames: ['customer_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'measures',
      new TableForeignKey({
        name: 'measures_customer_fk',
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('measures');
  }
}
