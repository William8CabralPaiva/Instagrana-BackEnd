import { Request, Response } from 'express';
import knex from '../database/connection';
import Jwt from 'jsonwebtoken';

export async function checkCredentials(usuario: String, senha: String) {
    const result = await knex('perfil').where('usuario', usuario).where('senha', senha);
    return result;
}

export async function login(request: Request, response: Response) {
    const { usuario, senha } = request.body;

    const result = await checkCredentials(usuario, senha);

    if (result.length > 0) {
        const token = Jwt.sign({ usuario }, "8bc74bd610621039470ca499796e7599", {
            expiresIn: "1w"
        })
        var json = result[0];
        json.token = token;
        return response.status(200).json(json)
    }

    return response.status(400).json({ message: 'Usuário não Encontrado' });
}

export async function cadastrar(request: Request, response: Response) {
    const { body } = request;

    const dados = {
        usuario: body.usuario,
        senha: body.senha,
        nome: body.nome,
        descricao: body.descricao,
        email: body.email,
        telefone: body.telefone,
        avatar: body.avatar
    };

    const selectUsername = await knex('perfil').where('usuario', body.usuario);

    if (selectUsername.length > 0) {
        return response.status(400).json({ error: "Usuário já existe, favor trocar o nome de usuário" })
    }

    const trx = await knex.transaction();
    const result = await trx('perfil').insert(dados);

    await trx.commit();

    if (result[0] != 0) {
        const token = Jwt.sign({ usuario: body.usuario }, "8bc74bd610621039470ca499796e7599", {
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

export async function idByUsername(usuario: String) {
    const result = await knex('perfil').select("id").where('usuario', String(usuario)).first();
    if (result != null) {
        return result.id;
    }
    return null;
}

export async function addSeguidor(request: Request, response: Response) {
    const { usuario, seguidor } = request.body;

    const perfil_id = await idByUsername(usuario);
    const seguidor_id = await idByUsername(seguidor);

    const data = {
        perfil_id,
        seguidor_id
    }

    if (perfil_id == null || seguidor_id == null) {
        return response.status(400).json({ error: "Não foi possível localizar o usuário" })
    }

    const verificaSeguidor = await knex("seguidores").where("perfil_id", perfil_id).where("seguidor_id", seguidor_id);

    if (verificaSeguidor.length > 0) {
        return response.json({ error: "Você ja esta seguindo esse usuário" });
    }

    const trx = await knex.transaction();
    await trx('seguidores').insert(data);

    await trx.commit();

    return response.status(200).json({ message: "Adicionado com Sucesso" });
}

export async function seguidores(request: Request, response: Response) {
    const { usuario } = request.body;

    const id = await idByUsername(usuario);

    if (usuario == null) {
        return response.status(400).json({ error: "Não foi possível localizar o usuário" })
    }

    const result = await knex("seguidores")
        .select("usuario", "nome", "descricao", "email", "telefone", "avatar", "verificado", "visivel")
        .join("perfil", "seguidores.seguidor_id", "=", "perfil.id")
        .where("perfil_id", id);

    return response.status(200).json(result);
}

export async function removeSeguidor(request: Request, response: Response) {
    const { usuario, seguidor } = request.body;

    const perfil_id = await idByUsername(usuario);
    const seguidor_id = await idByUsername(seguidor);

    const data = {
        perfil_id,
        seguidor_id
    }

    if (perfil_id == null || seguidor_id == null) {
        return response.status(400).json({ error: "Não foi possível localizar o usuário" })
    }

    const verificaSeguidor = await knex("seguidores").where("perfil_id", perfil_id).where("seguidor_id", seguidor_id);

    const trx = await knex.transaction();
    await trx('seguidores').delete(verificaSeguidor);

    await trx.commit();

    return response.status(200).json({ message: "Removido com Sucesso" });
}

