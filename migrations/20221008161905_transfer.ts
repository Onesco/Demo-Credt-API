import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('transfers', function (table) {
    table.increments('id').primary();
    table.integer('transaction_id').unsigned();
    table.integer('from').unsigned();
    table.integer('to').unsigned();
    table.float('balance_before');
    table.float('balance_after');
    table.dateTime('created_at').defaultTo(knex.fn.now());
    table.dateTime('updated_at');

    table.foreign('from').references('users.id').onDelete('CASCADE');
    table.foreign('to').references('users.id').onDelete('CASCADE');
    table
      .foreign('transaction_id')
      .references('transactions.id')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('transfers');
}
