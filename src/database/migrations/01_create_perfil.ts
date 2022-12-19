import { Knex } from 'knex';

const tabela = "profile";

export async function up(knex: Knex) {
    return knex.schema.createTable(tabela, table => {
        table.increments('id').primary();
        table.string('user').unique();
        table.string('password').notNullable();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('email').notNullable();
        table.string('phone', 11).notNullable();
        table.string('avatar');
        table.boolean('verify').notNullable().defaultTo(false);
        table.boolean('visible').notNullable().defaultTo(true);
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tabela);
}
