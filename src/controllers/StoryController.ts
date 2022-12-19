import knex from '../database/connection';
import { json, Request, Response } from 'express';
import { dataAmanhaFormatada } from '../helper/utils';

//nao testei stories
class StoryController {
    async addStory(request: Request, response: Response) {
        const { userId } = request;
        const file = request.file?.filename;

        var dataAmanha = dataAmanhaFormatada(new Date())

        if (file) {
            const trx = await knex.transaction();
            const result = await trx("stories").insert({ media: file, profile_id: userId, expira: dataAmanha })
            await trx.commit();
            return response.status(200).json({ message: "cadastrado com Sucesso" });
        }

        return response.status(404).json({ error: "Imagem não inserida" });


    }
    async showMyStory(request: Request, response: Response) {
        const { userId } = request;
        const select = await knex("stories").where("profile_id", userId).where("data");
        return response.status(200).json({ message: "cadastrado com Sucesso" });


        return response.status(404).json({ error: "Nenhuma informação encontrada" });


    }

    async showStory(request: Request, response: Response) {
        const { userId } = request;
        const file = request.file?.filename;
        const trx = await knex.transaction();

        if (!file) {
            const result = await trx("stories").insert({ media: file, profile_id: userId })
            return response.status(200).json({ message: "cadastrado com Sucesso" });

        }

        return response.status(404).json({ error: "Nenhuma informação encontrada" });


    }
    async teste(request: Request, response: Response) {
        var today = new Date();
        var dd = String(today.getDate() + 1).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        var _today = yyyy + '-' + mm + '-' + dd;
        var tempo = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        return response.status(200).json({ normal: today, alterado: _today + " " + tempo })

    }
}
export default StoryController;