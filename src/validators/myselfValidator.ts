import { celebrate, Segments, Joi } from 'celebrate';

export const loginValidator = celebrate(
    {
        [Segments.BODY]: Joi.object().keys({
            user: Joi.string().required(),
            password: Joi.string().required(),
        }),
    },
    {
        abortEarly: false,
    },
);

export const cadastroValidator = celebrate(
    {
        [Segments.BODY]: Joi.object().keys({
            user: Joi.string().required(),
            password: Joi.string().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            email: Joi.string().required().email(),
            phone: Joi.string().required().max(11),
            avatar: Joi.string()
        }),
    },
    {
        abortEarly: false,
    },
);

