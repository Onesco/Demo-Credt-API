import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('user_name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.dateTime('created_at').defaultTo(knex.fn.now());
    table.dateTime('updated_at');
    table.enu('role', ['ADMIN', 'USER', 'SUPERUSER']).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('users');
}
