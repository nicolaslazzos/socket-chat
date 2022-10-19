import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  REDIS_HOST: Joi.string().default('localhost').required(),
  REDIS_PORT: Joi.number().default(6379).required(),
});
