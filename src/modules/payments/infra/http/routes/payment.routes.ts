import { Router } from 'express';
import { container } from 'tsyringe';
import { PaymentController } from '../controllers/payment.controller';
import { celebrate, Joi, Segments } from 'celebrate';

const paymentRoutes = Router();
const paymentController = container.resolve(PaymentController);

paymentRoutes.post(
  '/process',
  celebrate({
    [Segments.BODY]: {
      amount: Joi.number().required(),
      order_id: Joi.string().uuid().required(),
    },
  }),
  (request, response) => paymentController.processPayment(request, response),
);

export default paymentRoutes;
