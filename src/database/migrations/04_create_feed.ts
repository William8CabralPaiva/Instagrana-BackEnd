import { Knex } from 'knex';

const tabela = "feed";

export async function up(knex: Knex) {
    return knex.schema.createTable(tabela, table => {
        table.increments('id').primary();
        table.string('description').notNullable();
        table.integer('profile_id').unsigned();

        table.foreign('profile_id')
            .references('id')
            .inTable('profile')
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
