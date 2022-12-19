import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import knex from '../database/connection';
import { ResponseError } from '../helper/types'

interface Payload {
    id: number,
    user: String,
    password: String
}

async function AuthMiddleware(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers;

    if (!authorization) {
        return response.status(401).send({ error: "Sem token" });
    }

    const token = authorization.replace("Bearer", "").trim();

    try {
        const data = jwt.verify(token, "8bc74bd610621039470ca499796e7599") as Payload
        const { id, user, password } = data

        const result = await knex('profile').where('user', user).where('password', password).first();

        if (result) {
            request.userId = id;
            request.user = user;
            request.userpassword = password;
            return next();
        }
        return response.status(401).send({ error: "senha alterada" });

    } catch (err) {
        let error: ResponseError = {
            code: 423,
            error: "Token invalido"
        };
        return response.status(error.code).send(error);
    }
}

export default AuthMiddleware;