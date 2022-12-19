import { json, Request, Response } from 'express';
import knex from '../database/connection';
import { TipoArquivo } from '../helper/types'

interface followerId {
    follower_id: Number,
}

class FeedController {
    //!cadastrar algo no user vinculado para testar
    async myFeed(request: Request, response: Response) {
        //var { page } = request.body;
        const { userId } = request;

        const result = await knex("feed")
            .leftJoin("feed_image", "feed.id", "=", "feed_image.feed_id")
            .leftJoin("feed_comments", "feed.id", "=", "feed_comments.feed_id")
            .where("feed.profile_id", userId)
            .orderBy("data", "desc")


        if (!result) {
            return response.status(404).json({ error: "Nenhuma informação encontrada" });
        }

        //TODO PAGINAR devolvendo o max de paginas
        return response.status(200).json(result);
    }
    async feedFollowers(request: Request, response: Response) {
        const { userId } = request;


        const result_followers: Array<followerId> = await knex("followers").select("follower_id").where("profile_id", userId);
        var followers: Array<Number> = Array<Number>();
        result_followers.forEach((follower: followerId) => {
            followers.push(follower.follower_id);
        });
        //!cadastrar algo no user vinculado para testar
        const result = await knex("feed")
            .join("profile", "feed.profile_id", "=", "profile.id")
            .leftJoin("feed_image", "feed.id", "=", "feed_image.feed_id")
            .leftJoin("feed_comments", "feed.id", "=", "feed_comments.feed_id")
            .where("profile_id", userId)
            .where("feed.profile_id", userId)
            .whereIn("profile.id", followers)
            .orderBy("data", "desc")

        if (!result) {
            return response.status(404).json({ error: "Nenhuma informação encontrada" });
        }

        return response.status(200).json(result);
    }
    async addFeed(request: Request, response: Response) {
        const { userId } = request;
        const { description } = request.body;
        const files = request.files as Array<TipoArquivo>
        const feed = {
            description,
            profile_id: userId
        }

        //.limit(0, 10);
        if (files && files.length > 0) {
            const trx = await knex.transaction();
            const result_feed = await trx('feed').insert(feed);

            if (result_feed[0]) {
                files.forEach(async _file => {
                    await trx("feed_image").insert({ feed_id: userId, name: _file.fieldname, media: _file.fieldname })
                });
                await trx.commit();
                return response.status(200).json({ message: "feed cadastrado com sucesso" });
            }
            await trx.commit();
        }
        return response.status(401).json({ error: "erro" });

    }
    async addComments(request: Request, response: Response) {
        const { id, comment, like } = request.body;

        const result = {
            id,
            comment,
            like
        }
        const select = await knex("feed_comments").where("feed_id", id);
        if (!select) {
            return response.status(404).json({ error: "Nenhuma informação encontrada" });
        }

        const trx = await knex.transaction();
        const insert = await trx('feed').insert(result);
        await trx.commit();


        if (!insert) {
            return response.status(404).json({ error: "Não Foi Possivel inserir" });
        }

        return response.status(404).json({ message: "Adicionado com Sucesso!" });

    }
    async addFiles(request: Request, response: Response) {
        const { userId } = request;
        const { id } = request.body;
        const files = request.files as Array<TipoArquivo>


        const select = await knex("feed").where("id", id);

        if (!select) {
            return response.status(404).json({ error: "Feed Não Encontrado" });
        }
        //.limit(0, 10);
        if (files && files.length > 0) {
            const trx = await knex.transaction();

            files.forEach(async _file => {
                await trx("feed_image").insert({ feed_id: userId, name: _file.fieldname, media: _file.fieldname })
            });
            await trx.commit();
            return response.status(200).json({ message: "feed cadastrado com sucesso" });

            await trx.commit();
        }
        return response.status(401).json({ error: "erro" });

    }


}
export default FeedController;