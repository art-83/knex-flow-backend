import { Joi } from 'celebrate';

const timestampQueryOptionsSchema = {
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
};
export { timestampQueryOptionsSchema };
