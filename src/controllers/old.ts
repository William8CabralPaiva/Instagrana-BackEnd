import { Request, Response } from 'express';
import knex from '../database/connection';
import Jwt from 'jsonwebtoken';

export async function checkCredentials(user: String, password: String) {
    const result = await knex('profile').where('user', user).where('password', password);
    return result;
}

export async function login(request: Request, response: Response) {
    const { user, password } = request.body;

    const result = await checkCredentials(user, password);

    if (result.length > 0) {
        const token = Jwt.sign({ user }, "8bc74bd610621039470ca499796e7599", {
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
        user: body.user,
        password: body.password,
        name: body.name,
        description: body.description,
        email: body.email,
        phone: body.phone,
        avatar: body.avatar
    };

    const selectUsername = await knex('profile').where('user', body.user);

    if (selectUsername.length > 0) {
        return response.status(400).json({ error: "Usuário já existe, favor trocar o name de usuário" })
    }

    const trx = await knex.transaction();
    const result = await trx('profile').insert(dados);

    await trx.commit();

    if (result[0] != 0) {
        const token = Jwt.sign({ user: body.user }, "8bc74bd610621039470ca499796e7599", {
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

export async function idByUsername(user: String) {
    const result = await knex('profile').select("id").where('user', String(user)).first();
    if (result != null) {
        return result.id;
    }
    return null;
}

export async function addfollower(request: Request, response: Response) {
    const { user, follower } = request.body;

    const profile_id = await idByUsername(user);
    const follower_id = await idByUsername(follower);

    const data = {
        profile_id,
        follower_id
    }

    if (profile_id == null || follower_id == null) {
        return response.status(400).json({ error: "Não foi possível localizar o usuário" })
    }

    const verificafollower = await knex("followers").where("profile_id", profile_id).where("follower_id", follower_id);

    if (verificafollower.length > 0) {
        return response.json({ error: "Você ja esta seguindo esse usuário" });
    }

    const trx = await knex.transaction();
    await trx('followers').insert(data);

    await trx.commit();

    return response.status(200).json({ message: "Adicionado com Sucesso" });
}

export async function followers(request: Request, response: Response) {
    const { user } = request.body;

    const id = await idByUsername(user);

    if (user == null) {
        return response.status(400).json({ error: "Não foi possível localizar o usuário" })
    }

    const result = await knex("followers")
        .select("user", "name", "description", "email", "phone", "avatar", "verify", "visible")
        .join("profile", "followers.follower_id", "=", "profile.id")
        .where("profile_id", id);

    return response.status(200).json(result);
}

export async function removefollower(request: Request, response: Response) {
    const { user, follower } = request.body;

    const profile_id = await idByUsername(user);
    const follower_id = await idByUsername(follower);

    const data = {
        profile_id,
        follower_id
    }

    if (profile_id == null || follower_id == null) {
        return response.status(400).json({ error: "Não foi possível localizar o usuário" })
    }

    const verificafollower = await knex("followers").where("profile_id", profile_id).where("follower_id", follower_id);

    const trx = await knex.transaction();
    await trx('followers').delete(verificafollower);

    await trx.commit();

    return response.status(200).json({ message: "Removido com Sucesso" });
}

