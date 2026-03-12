import Joi from 'joi';

const PARAMS = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),

  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
};

export const configSchema = Joi.object<typeof PARAMS>(PARAMS);
