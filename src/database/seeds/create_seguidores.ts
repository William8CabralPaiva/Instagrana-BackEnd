import { Knex } from "knex";

export async function seed(knex: Knex) {
    return knex('followers').insert([
        {
            profile_id: "1",
            follower_id: "2"
        },
        {
            profile_id: "1",
            follower_id: "3"
        }
    ]);
}
