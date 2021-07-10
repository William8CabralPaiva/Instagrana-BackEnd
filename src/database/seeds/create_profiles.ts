import { Knex } from "knex";

export async function seed(knex: Knex) {
    return knex('perfil').insert([
        {
            usuario: "william8cabral",
            senha: "12345678",
            nome: "William Cabral",
            descricao: "Programador",
            email: "william8cabral@gmail.com",
            telefone: "13981258820",
            avatar: "",
            verificado: false,
            visivel: true,
        },
        {
            usuario: "alessandracabral",
            senha: "12345678",
            nome: "Alessandra Cabral",
            descricao: "mãe",
            email: "alessandra@gmail.com",
            telefone: "13981522235",
            avatar: "",
            verificado: false,
            visivel: true
        },
        {
            usuario: "bruno10cabral",
            senha: "12345678",
            nome: "Bruno Cabral",
            descricao: "irmão do william",
            email: "asdas@gmail.com",
            telefone: "13981258820",
            avatar: "",
            verificado: false,
            visivel: true
        },
        {
            usuario: "ivoripina",
            senha: "12345678",
            nome: "Ivo Ripina",
            descricao: "pai",
            email: "ivoripina@gmail.com",
            telefone: "13981462462",
            avatar: "",
            verificado: false,
            visivel: true,
        }
    ]);
}
