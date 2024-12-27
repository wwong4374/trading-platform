import type { Knex } from 'knex';

const tableName = 'securities';
const validTypes = ['STOCK', 'BOND', 'ETF', 'CRYPTO'];

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary().notNullable().defaultTo(knex.fn.uuid());
    table.timestamp('created').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated').notNullable().defaultTo(knex.fn.now());
    table.text('ticker').notNullable();
    table.text('name').notNullable();
    table.text('type').notNullable().checkIn(validTypes);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
