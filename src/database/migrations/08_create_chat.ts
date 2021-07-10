import { Knex } from 'knex';

const tabela = "chat";

export async function up(knex: Knex) {
    return knex.schema.createTable(tabela, table => {
        table.increments("id").primary();
        table.integer("perfil_id").unsigned();

        table.foreign('perfil_id')
            .references('id')
            .inTable('perfil')
            .onDelete('CASCADE')
            .onUpdate('NO ACTION');

    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tabela);
}
