/* eslint-disable prettier/prettier */
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('wallets', function (table) {
        
        table.increments('id').primary();
        table.integer('user_id').unsigned();
        table.decimal('balance').defaultTo(0);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at');

        table.foreign('user_id').references('users.id').onDelete('CASCADE');
    });
}


export async function down(knex: Knex): Promise<void> {
    return await knex.schema
      .dropTable("wallets")
}

