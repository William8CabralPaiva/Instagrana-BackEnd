declare namespace Express {
    export interface Request {
        //colocar --files no yarn run dev
        usuarioId: Number,
        usuario: String,
        usuarioSenha: String
    }
}