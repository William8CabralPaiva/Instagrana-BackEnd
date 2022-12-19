import { Request, Response } from 'express';
import knex from '../database/connection';
import Jwt from 'jsonwebtoken';
import { follower, TipoArquivo } from '../helper/types';

class AuthController {

    async random(request: Request, response: Response) {
        return response.status(200).json({ message: 'TESTE 2' });
    }

    async login(request: Request, response: Response) {
        const { user, password } = request.body;

        const result = await knex('profile').where('user', user).where('password', password).first();

        if (result) {
            const id = result.id
            const token = Jwt.sign({ id: id, user, password }, "8bc74bd610621039470ca499796e7599", {
                expiresIn: "1w"
            })
            var json: follower = result;
            json.token = token;

            //esse bloco de baixo é pra converter 0 e 1 para boleano
            if (json.verify) {
                json.verify = true
            } else {
                json.verify = false
            }
            if (json.visible) {
                json.visible = true
            } else {
                json.visible = false
            }

            return response.status(200).json(json)
        }

        return response.status(400).json({ message: 'Usuário não Encontrado' });
    }

    async register(request: Request, response: Response) {
        const { body } = request;
        const file = request.file

        const dados = {
            user: body.user,
            password: body.password,
            name: body.name,
            description: body.description,
            email: body.email,
            phone: body.phone,
            avatar: file != null ? file.fieldname : ""
        };

        const selectUsername = await knex('profile').where('user', body.user);

        if (selectUsername.length > 0) {
            return response.status(400).json({ error: "Usuário já existe, favor trocar o name de usuário" })
        }

        const trx = await knex.transaction();
        const result = await trx('profile').insert(dados);

        await trx.commit();

        if (result[0] != 0) {
            //verificar esse id
            const token = Jwt.sign({ id: result, user: body.user, password: body.password }, "8bc74bd610621039470ca499796e7599", {
                expiresIn: "1w"
            })
            var json = {
                id: result[0],
                token,
                message: "Cadastrado com Sucesso",
            }

            return response.status(200).json(json)
        }

        return response.status(400).json({ error: "erro ao cadastrar" })
    }
}
export default AuthController;