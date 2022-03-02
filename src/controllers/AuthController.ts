import { Request, Response } from 'express';
import knex from '../database/connection';
import Jwt from 'jsonwebtoken';
import { TipoArquivo } from '../helper/types';

class AuthController {

    async random(request: Request, response: Response) {
        return response.status(200).json({ message: 'TESTE 2' });
    }

    async login(request: Request, response: Response) {
        const { usuario, senha } = request.body;

        const result = await knex('perfil').where('usuario', usuario).where('senha', senha).first();

        if (result) {
            const id = result.id
            const token = Jwt.sign({ id: id, usuario, senha }, "8bc74bd610621039470ca499796e7599", {
                expiresIn: "1w"
            })
            var json = result;
            json.token = token;
            return response.status(200).json(json)
        }

        return response.status(400).json({ message: 'Usuário não Encontrado' });
    }

    async cadastrar(request: Request, response: Response) {
        const { body } = request;
        const file = request.file

        const dados = {
            usuario: body.usuario,
            senha: body.senha,
            nome: body.nome,
            descricao: body.descricao,
            email: body.email,
            telefone: body.telefone,
            avatar: file != null ? file.fieldname : ""
        };

        const selectUsername = await knex('perfil').where('usuario', body.usuario);

        if (selectUsername.length > 0) {
            return response.status(400).json({ error: "Usuário já existe, favor trocar o nome de usuário" })
        }

        const trx = await knex.transaction();
        const result = await trx('perfil').insert(dados);

        await trx.commit();

        if (result[0] != 0) {
            //verificar esse id
            const token = Jwt.sign({ id: result, usuario: body.usuario, senha: body.senha }, "8bc74bd610621039470ca499796e7599", {
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