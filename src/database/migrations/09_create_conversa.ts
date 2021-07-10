import { Knex } from 'knex';

const tabela = "conversa";

export async function up(knex: Knex) {
    return knex.schema.createTable(tabela, table => {
        table.integer('chat_id').unsigned();
        table.string("conversa").notNullable();
        table.boolean("curtir").defaultTo(false);
        table.string("media");

        table.foreign('chat_id')
            .references('id')
            .inTable('chat')
            .onDelete('CASCADE')
            .onUpdate('NO ACTION');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tabela);
}
