import { Knex } from 'knex';

const tabela = "perfil";

export async function up(knex: Knex) {
    return knex.schema.createTable(tabela, table => {
        table.increments('id').primary();
        table.string('usuario').unique();
        table.string('senha').notNullable();
        table.string('nome').notNullable();
        table.string('descricao').notNullable();
        table.string('email').notNullable();
        table.string('telefone', 11).notNullable();
        table.string('avatar');
        table.boolean('verificado').notNullable().defaultTo(false);
        table.boolean('visivel').notNullable().defaultTo(true);
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tabela);
}
