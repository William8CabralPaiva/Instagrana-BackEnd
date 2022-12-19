import { Knex } from 'knex';

const tabela = "feed_comments";

export async function up(knex: Knex) {
    return knex.schema.createTable(tabela, table => {
        table.integer('feed_id').unsigned();
        table.string('comment').notNullable();
        table.boolean("like").defaultTo(false);

        table.foreign('feed_id')
            .references('id')
            .inTable('feed')
            .onDelete('CASCADE')
            .onUpdate('NO ACTION');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(tabela);
}
