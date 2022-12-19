import { Request, Response } from 'express';
import knex from '../database/connection';
import Jwt from 'jsonwebtoken';
import { follower } from '../helper/types';

class ProfileController {
    async addFollower(request: Request, response: Response) {
        const { follower } = request.params;
        const { userId } = request;

        const _follower = await knex('profile').select("id").where('user', String(follower)).first();

        if (userId == null || _follower == null) {
            return response.status(400).json({ error: "Não foi possível localizar o usuário" })
        }

        const verificafollower = await knex("followers").where("profile_id", userId).where("follower_id", _follower.id);

        if (verificafollower.length > 0) {
            return response.json({ error: "Você ja esta seguindo esse usuário" });
        }

        const data = {
            profile_id: userId,
            follower_id: _follower.id
        }

        const trx = await knex.transaction();
        await trx('followers').insert(data);

        await trx.commit();

        return response.status(200).json({ message: "Adicionado com Sucesso" });
    }

    //! mostrar profile nao esta funcionando arrumar
    //* verificar se é visible se sim, mostrar, se nao verifica se esta sendo seguido se sim mostra o profile do user se não exibir msg
    async showProfile(request: Request, response: Response) {
        const { id } = request.params;
        const { userId } = request;

        const _follower: follower = await knex('profile').where('id', id).first();

        if (userId == null || _follower == null) {
            return response.status(400).json({ error: "Não foi possível localizar o usuário" })
        }

        const verificafollower = await knex("followers").where("profile_id", userId).where("follower_id", _follower.id);

        if (!verificafollower && !_follower.visible as Boolean) {
            return response.status(200).json({ error: "O profile deste usuário não esta visível ao publico" });
        }
        const profile: follower = await knex("profile").where("id", id).first();
        const qtd_seguindo = await knex("followers").select(knex.raw("sum(profile_id) as quantidade")).where("profile_id", userId).first();
        const qtd_followers = await knex("followers").select(knex.raw("sum(follower_id) as quantidade")).where("follower_id", id).first();

        return response.status(200).json({
            profile: profile,
            qtd_followers: qtd_followers.quantidade ? qtd_followers.quantidade : 0,
            qtd_seguindo: qtd_seguindo.quantidade ? qtd_seguindo.quantidade : 0
        });
    }

    async profileList(request: Request, response: Response) {
        const { follower } = request.params;
        const { userId } = request;

        const _follower = await knex('profile').select("id").where('id', String(follower)).first();

        if (userId == null || _follower == null) {
            return response.status(400).json({ error: "Não foi possível localizar o usuário" })
        }

        const verificafollower = await knex("followers").where("profile_id", userId).where("follower_id", _follower.id);

        if (verificafollower.length > 0) {
            return response.json({ error: "Você ja esta seguindo esse usuário" });
        }

        const data = {
            profile_id: userId,
            follower_id: _follower.id
        }

        const trx = await knex.transaction();
        await trx('followers').insert(data);

        await trx.commit();

        return response.status(200).json({ message: "Adicionado com Sucesso" });
    }

    async followers(request: Request, response: Response) {
        const { userId } = request;

        const result: follower[] = await knex("followers")
            .select("user", "name", "description", "email", "phone", "avatar", "verify", "visible")
            .join("profile", "followers.follower_id", "=", "profile.id")
            .where("profile_id", userId);


        var a: follower[] = result;

        a.forEach(element => {

            if (element.visible) {
                element.visible = true
            } else {
                element.visible = false
            }

            if (element.verify) {
                element.verify = true
            } else {
                element.verify = false
            }
        });



        return response.status(200).json(a);
    }

    async removeFollowers(request: Request, response: Response) {
        const { follower } = request.params;
        const { userId } = request;

        const _follower = await knex('profile').select("id").where('user', String(follower)).first();

        if (_follower == null) {
            return response.status(400).json({ error: "Não foi possível localizar o usuário" })
        }

        const result = await knex("followers").where("profile_id", userId).where("follower_id", _follower.id)
        if (!result) {
            return response.status(401).json({ error: "Erro ao deletar" });
        }

        return response.status(200).json({ message: "Removido com Sucesso" });
    }
}
export default ProfileController;