import type { Knex } from 'knex';

const tableName = 'prices';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary().notNullable().defaultTo(knex.fn.uuid());
    table.timestamp('created').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated').notNullable().defaultTo(knex.fn.now());
    table.uuid('securityId').notNullable().references('id').inTable('securities');
    table.date('tradingDate').notNullable();
    table.integer('open').notNullable();
    table.integer('high').notNullable();
    table.integer('low').notNullable();
    table.integer('close').notNullable();
    table.integer('volume').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
