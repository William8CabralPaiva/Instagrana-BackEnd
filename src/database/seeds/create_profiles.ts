import { Knex } from "knex";

export async function seed(knex: Knex) {
    return knex('profile').insert([
        {
            user: "william8cabral",
            password: "12345678",
            name: "William Cabral",
            description: "Programador",
            email: "william8cabral@gmail.com",
            phone: "13981258820",
            avatar: "",
            verify: false,
            visible: true,
        },
        {
            user: "alessandracabral",
            password: "12345678",
            name: "Alessandra Cabral",
            description: "mãe",
            email: "alessandra@gmail.com",
            phone: "13981522235",
            avatar: "",
            verify: false,
            visible: true
        },
        {
            user: "bruno10cabral",
            password: "12345678",
            name: "Bruno Cabral",
            description: "irmão do william",
            email: "asdas@gmail.com",
            phone: "13981258820",
            avatar: "",
            verify: false,
            visible: true
        },
        {
            user: "ivoripina",
            password: "12345678",
            name: "Ivo Ripina",
            description: "pai",
            email: "ivoripina@gmail.com",
            phone: "13981462462",
            avatar: "",
            verify: false,
            visible: true,
        }
    ]);
}
