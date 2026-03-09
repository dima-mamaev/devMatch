import * as Joi from 'joi';
import { EnvironmentEnum } from './shared/enums/environment.enum';

const PARAMS = {
  // general
  PORT: Joi.number().default(4000),
  TZ: Joi.string(),
  ENVIRONMENT: Joi.string()
    .valid(...Object.values(EnvironmentEnum))
    .default(EnvironmentEnum.Dev)
    .required(),

  // database
  POSTGRES_HOST: Joi.string().default('localhost').required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string(),
  POSTGRES_PASSWORD: Joi.string(),

  // Auth0
  AUTH0_AUDIENCE: Joi.string().required(),
  AUTH0_DOMAIN: Joi.string().required(),
  AUTH0_CLIENT_ID: Joi.string().required(),
  AUTH0_CLIENT_SECRET: Joi.string().required(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),

  // Redis (for BullMQ)
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
};

export const configSchema = Joi.object<typeof PARAMS>(PARAMS);
