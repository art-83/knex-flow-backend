import { Joi } from 'celebrate';

const defaultQueryOptionsSchema = {
  offset: Joi.number().integer().min(0).optional(),
  limit: Joi.number().integer().min(1).optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
};

const timestampQueryOptionsSchema = {
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
};
export { defaultQueryOptionsSchema, timestampQueryOptionsSchema };
