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
export interface follower {
    id: Number,
    user: String,
    password: String,
    name: String,
    description: String,
    email: String,
    phone: String,
    avatar: String,
    verify: Boolean,
    visible: Boolean,
    token: String
}

export interface ResponseError {
    code: number,
    error: String,
}