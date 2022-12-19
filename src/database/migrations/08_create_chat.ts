import { Knex } from 'knex';

const tabela = "chat";

export async function up(knex: Knex) {
    return knex.schema.createTable(tabela, table => {
        table.increments("id").primary();
        table.integer("profile_id").unsigned();

        table.foreign('profile_id')
            .references('id')
            .inTable('profile')
            .onDelete('CASCADE')
            .onUpdate('NO ACTION');

    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tabela);
}
