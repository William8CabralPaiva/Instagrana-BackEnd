import { Knex } from "knex";

export async function seed(knex: Knex) {
    return knex('seguidores').insert([
        {
            perfil_id: "1",
            seguidor_id: "2"
        },
        {
            perfil_id: "1",
            seguidor_id: "3"
        }
    ]);
}
