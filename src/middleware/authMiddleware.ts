import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import knex from '../database/connection';

interface Payload {
    id: number,
    usuario: String,
    senha: String
}

async function AuthMiddleware(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers;

    if (!authorization) {
        return response.status(401).send({ error: "Sem token" });
    }

    const token = authorization.replace("Bearer", "").trim();

    try {
        const data = jwt.verify(token, "8bc74bd610621039470ca499796e7599") as Payload
        const { id, usuario, senha } = data

        const result = await knex('perfil').where('usuario', usuario).where('senha', senha).first();

        if (result) {
            request.usuarioId = id;
            request.usuario = usuario;
            request.usuarioSenha = senha;
            return next();
        }
        return response.status(401).send({ error: "Senha alterada" });

    } catch (err) {
        return response.status(401).send({ error: "Token invalido" });
    }
}

export default AuthMiddleware;