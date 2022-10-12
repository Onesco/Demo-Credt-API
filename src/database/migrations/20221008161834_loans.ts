import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('loans', function (table) {
    table.increments('id').primary();
    table.integer('transaction_id').unsigned();
    table.integer('user_id').unsigned();
    table
      .enu('loan_status', ['CLOSED', 'PENDING', 'APPROVED', 'DECLINED'])
      .defaultTo('PENDING');
    table.float('balance_after');
    table.dateTime('created_at').defaultTo(knex.fn.now());
    table.dateTime('updated_at');

    table
      .foreign('transaction_id')
      .references('transactions.id')
      .onDelete('CASCADE');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('loans');
}
