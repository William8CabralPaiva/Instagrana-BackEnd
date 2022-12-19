declare namespace Express {
    export interface Request {
        //colocar --files no yarn run dev
        userId: Number,
        user: String,
        userpassword: String
    }

}