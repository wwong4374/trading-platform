import type { Knex } from 'knex';

const tableName = 'securities';
const validTypes = ['stock', 'bond', 'etf', 'crypto'];

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary().notNullable(),
      table.timestamp('created').notNullable(),
      table.timestamp('updated').notNullable(),
      table.text('ticker').notNullable(),
      table.text('name').notNullable(),
      table.text('type').notNullable().checkIn(validTypes);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
