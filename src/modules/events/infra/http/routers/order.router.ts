import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { OrderStatus } from '../../orm/enums/order-status.enum';
import {
  defaultQueryOptionsSchema,
  timestampQueryOptionsSchema,
} from '../../../../../shared/infra/http/dtos/query-options-schema.dto';
import { OrderController } from '../controllers/order.controller';

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      id: Joi.string().uuid().optional(),
      event_id: Joi.string().uuid().optional(),
      total_amount: Joi.number().positive().optional(),
      status: Joi.string()
        .valid(...Object.values(OrderStatus))
        .optional(),
      ...timestampQueryOptionsSchema,
      ...defaultQueryOptionsSchema,
    }),
  }),
  orderController.findUserOrders,
);
export { orderRouter };
