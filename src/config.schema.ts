import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  REDIS_HOST: Joi.string().default('localhost').required(),
  REDIS_PORT: Joi.number().default(6379).required(),
  DB_TYPE: Joi.string().default('mongodb').required(),
  DB_HOST: Joi.string().default('localhost').required(),
  DB_PORT: Joi.number().default(27017).required(),
  DB_NAME: Joi.string().default('socket-chat').required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_REPLICA_SET: Joi.string(),
  JWT_SECRET: Joi.string().required(),
});
