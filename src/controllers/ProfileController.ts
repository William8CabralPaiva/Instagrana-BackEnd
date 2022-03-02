import { Request, Response } from 'express';
import knex from '../database/connection';
import Jwt from 'jsonwebtoken';
import { Seguidor } from '../helper/types';

class ProfileController {
    async addSeguidor(request: Request, response: Response) {
        const { seguidor } = request.params;
        const { usuarioId } = request;

        const _seguidor = await knex('perfil').select("id").where('usuario', String(seguidor)).first();

        if (usuarioId == null || _seguidor == null) {
            return response.status(400).json({ error: "Não foi possível localizar o usuário" })
        }

        const verificaSeguidor = await knex("seguidores").where("perfil_id", usuarioId).where("seguidor_id", _seguidor.id);

        if (verificaSeguidor.length > 0) {
            return response.json({ error: "Você ja esta seguindo esse usuário" });
        }

        const data = {
            perfil_id: usuarioId,
            seguidor_id: _seguidor.id
        }

        const trx = await knex.transaction();
        await trx('seguidores').insert(data);

        await trx.commit();

        return response.status(200).json({ message: "Adicionado com Sucesso" });
    }

    //! mostrar perfil nao esta funcionando arrumar
    //* verificar se é visivel se sim, mostrar, se nao verifica se esta sendo seguido se sim mostra o perfil do usuario se não exibir msg
    async mostraPerfil(request: Request, response: Response) {
        const { id } = request.params;
        const { usuarioId } = request;

        const _seguidor: Seguidor = await knex('perfil').where('id', id).first();

        if (usuarioId == null || _seguidor == null) {
            return response.status(400).json({ error: "Não foi possível localizar o usuário" })
        }

        const verificaSeguidor = await knex("seguidores").where("perfil_id", usuarioId).where("seguidor_id", _seguidor.id);

        if (!verificaSeguidor && !_seguidor.visivel as Boolean) {
            return response.status(200).json({ error: "O perfil deste usuário não esta visível ao publico" });
        }
        const perfil: Seguidor = await knex("perfil").where("id", id).first();
        const qtd_seguindo = await knex("seguidores").select(knex.raw("sum(perfil_id) as quantidade")).where("perfil_id", usuarioId).first();
        const qtd_seguidores = await knex("seguidores").select(knex.raw("sum(seguidor_id) as quantidade")).where("seguidor_id", id).first();

        return response.status(200).json({
            perfil: perfil,
            qtd_seguidores: qtd_seguidores.quantidade ? qtd_seguidores.quantidade : 0,
            qtd_seguindo: qtd_seguindo.quantidade ? qtd_seguindo.quantidade : 0
        });
    }

    async listaPerfil(request: Request, response: Response) {
        const { seguidor } = request.params;
        const { usuarioId } = request;

        const _seguidor = await knex('perfil').select("id").where('id', String(seguidor)).first();

        if (usuarioId == null || _seguidor == null) {
            return response.status(400).json({ error: "Não foi possível localizar o usuário" })
        }

        const verificaSeguidor = await knex("seguidores").where("perfil_id", usuarioId).where("seguidor_id", _seguidor.id);

        if (verificaSeguidor.length > 0) {
            return response.json({ error: "Você ja esta seguindo esse usuário" });
        }

        const data = {
            perfil_id: usuarioId,
            seguidor_id: _seguidor.id
        }

        const trx = await knex.transaction();
        await trx('seguidores').insert(data);

        await trx.commit();

        return response.status(200).json({ message: "Adicionado com Sucesso" });
    }

    async seguidores(request: Request, response: Response) {
        const { usuarioId } = request;

        const result: Seguidor[] = await knex("seguidores")
            .select("usuario", "nome", "descricao", "email", "telefone", "avatar", "verificado", "visivel")
            .join("perfil", "seguidores.seguidor_id", "=", "perfil.id")
            .where("perfil_id", usuarioId);


        var a: Seguidor[] = result;

        a.forEach(element => {

            if (element.visivel) {
                element.visivel = true
            } else {
                element.visivel = false
            }

            if (element.verificado) {
                element.verificado = true
            } else {
                element.verificado = false
            }
        });



        return response.status(200).json(a);
    }

    async removeSeguidor(request: Request, response: Response) {
        const { seguidor } = request.params;
        const { usuarioId } = request;

        const _seguidor = await knex('perfil').select("id").where('usuario', String(seguidor)).first();

        if (_seguidor == null) {
            return response.status(400).json({ error: "Não foi possível localizar o usuário" })
        }

        const result = await knex("seguidores").where("perfil_id", usuarioId).where("seguidor_id", _seguidor.id)
        if (!result) {
            return response.status(401).json({ error: "Erro ao deletar" });
        }

        return response.status(200).json({ message: "Removido com Sucesso" });
    }
}
export default ProfileController;