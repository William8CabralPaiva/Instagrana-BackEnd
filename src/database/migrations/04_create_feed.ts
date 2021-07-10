import { Knex } from 'knex';

const tabela = "feed";

export async function up(knex: Knex) {
    return knex.schema.createTable(tabela, table => {
        table.increments('id').primary();
        table.string('descricao').notNullable();
        table.integer('perfil_id').unsigned();

        table.foreign('perfil_id')
            .references('id')
            .inTable('perfil')
            .onDelete('CASCADE')
            .onUpdate('NO ACTION');

        table.timestamp('data')
            .defaultTo(knex.fn.now())
            .notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tabela);
}
