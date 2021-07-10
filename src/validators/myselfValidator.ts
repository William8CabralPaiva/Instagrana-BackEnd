import { celebrate, Segments, Joi } from 'celebrate';

export const loginValidator = celebrate(
    {
        [Segments.BODY]: Joi.object().keys({
            usuario: Joi.string().required(),
            senha: Joi.string().required(),
        }),
    },
    {
        abortEarly: false,
    },
);

export const cadastroValidator = celebrate(
    {
        [Segments.BODY]: Joi.object().keys({
            usuario: Joi.string().required(),
            senha: Joi.string().required(),
            nome: Joi.string().required(),
            descricao: Joi.string().required(),
            email: Joi.string().required().email(),
            telefone: Joi.string().required().max(11),
            avatar: Joi.string()
        }),
    },
    {
        abortEarly: false,
    },
);

