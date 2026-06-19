import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { OrderStatus } from '../../orm/enums/order-status.enum';
import { defaultQueryOptionsSchema } from '../../../../../shared/dtos/incoming/http/schemas/default-query-options.schema';
import { timestampQueryOptionsSchema } from '../../../../../shared/dtos/incoming/http/schemas/timestamp-query-options.schema';
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

orderRouter.post(
  '/:id/refund',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    [Segments.BODY]: Joi.object({
      reason: Joi.string().max(500).optional(),
    }),
  }),
  orderController.requestRefund,
);
export { orderRouter };
