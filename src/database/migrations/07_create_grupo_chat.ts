import { Knex } from 'knex';

const tabela = "grupo_chat";

export async function up(knex: Knex) {
    return knex.schema.createTable(tabela, table => {
        table.integer("id").notNullable();
        table.integer("profile_id").unsigned();
        table.boolean("tipo").defaultTo(false);

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
