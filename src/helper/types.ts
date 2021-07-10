export interface TipoArquivo {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
}
export interface Seguidor {
    id: Number,
    usuario: String,
    senha: String,
    nome: String,
    descricao: String,
    email: String,
    telefone: String,
    avatar: String,
    verificado: Boolean,
    visivel: Boolean
}