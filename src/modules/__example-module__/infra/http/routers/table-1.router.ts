import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import Table1Controller from '../controllers/table-1.controller';

const table1Router = Router();
const table1Controller = new Table1Controller();

table1Router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      table1_id: Joi.string().uuid().required(),
      table2_id: Joi.string().uuid().required(),
    }).required(),
  }),
  table1Controller.create,
);

table1Router.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().optional(),
      name: Joi.string().optional(),
      table1_id: Joi.string().uuid().optional(),
      table2_id: Joi.string().uuid().optional(),
      offset: Joi.number().optional(),
      limit: Joi.number().optional(),
    },
  }),
  table1Controller.find,
);

table1Router.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: Joi.object({
      name: Joi.string().optional(),
      table1_id: Joi.string().uuid().optional(),
      table2_id: Joi.string().uuid().optional(),
    }).required(),
  }),
  table1Controller.update,
);

table1Router.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  table1Controller.delete,
);

export default table1Router;
