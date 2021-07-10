import { json, Request, Response } from 'express';
import knex from '../database/connection';
import { TipoArquivo } from '../helper/types'

interface SeguidorId {
    seguidor_id: Number,
}

class FeedController {
    //!cadastrar algo no usuario vinculado para testar
    async feedPessoal(request: Request, response: Response) {
        //var { page } = request.body;
        const { usuarioId } = request;

        const result = await knex("feed")
            .leftJoin("feed_image", "feed.id", "=", "feed_image.feed_id")
            .leftJoin("feed_comentarios", "feed.id", "=", "feed_comentarios.feed_id")
            .where("feed.perfil_id", usuarioId)
            .orderBy("data", "desc")


        if (!result) {
            return response.status(404).json({ error: "Nenhuma informação encontrada" });
        }

        //TODO PAGINAR devolvendo o max de paginas
        return response.status(200).json(result);
    }
    async feedSeguidores(request: Request, response: Response) {
        const { usuarioId } = request;


        const result_seguidores: Array<SeguidorId> = await knex("seguidores").select("seguidor_id").where("perfil_id", usuarioId);
        var seguidores: Array<Number> = Array<Number>();
        result_seguidores.forEach((seguidor: SeguidorId) => {
            seguidores.push(seguidor.seguidor_id);
        });
        //!cadastrar algo no usuario vinculado para testar
        const result = await knex("feed")
            .join("perfil", "feed.perfil_id", "=", "perfil.id")
            .leftJoin("feed_image", "feed.id", "=", "feed_image.feed_id")
            .leftJoin("feed_comentarios", "feed.id", "=", "feed_comentarios.feed_id")
            .where("perfil_id", usuarioId)
            .where("feed.perfil_id", usuarioId)
            .whereIn("perfil.id", seguidores)
            .orderBy("data", "desc")

        if (!result) {
            return response.status(404).json({ error: "Nenhuma informação encontrada" });
        }

        return response.status(200).json(result);
    }
    async addFeed(request: Request, response: Response) {
        const { usuarioId } = request;
        const { descricao } = request.body;
        const files = request.files as Array<TipoArquivo>
        const feed = {
            descricao,
            perfil_id: usuarioId
        }

        //.limit(0, 10);
        if (files && files.length > 0) {
            const trx = await knex.transaction();
            const result_feed = await trx('feed').insert(feed);

            if (result_feed[0]) {
                files.forEach(async _file => {
                    await trx("feed_image").insert({ feed_id: usuarioId, nome: _file.fieldname, media: _file.fieldname })
                });
                await trx.commit();
                return response.status(200).json({ message: "feed cadastrado com sucesso" });
            }
            await trx.commit();
        }
        return response.status(401).json({ error: "erro" });

    }
    async addComentario(request: Request, response: Response) {
        const { id, comentario, curtir } = request.body;

        const result = {
            id,
            comentario,
            curtir
        }
        const select = await knex("feed_comentarios").where("feed_id", id);
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
        const { usuarioId } = request;
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
                await trx("feed_image").insert({ feed_id: usuarioId, nome: _file.fieldname, media: _file.fieldname })
            });
            await trx.commit();
            return response.status(200).json({ message: "feed cadastrado com sucesso" });

            await trx.commit();
        }
        return response.status(401).json({ error: "erro" });

    }


}
export default FeedController;