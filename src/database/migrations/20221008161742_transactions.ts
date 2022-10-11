import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary();
    table.integer('wallet_id').unsigned();
    table.enu('txn_type', ['CREDIT', 'DEBIT', 'LOAN', 'REPAY', 'TRANSFER']);
    table.float('amount').notNullable();
    table.uuid('reference');
    table.dateTime('created_at').defaultTo(knex.fn.now());
    table.dateTime('updated_at');

    table.foreign('wallet_id').references('wallets.id').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('transactions');
}
