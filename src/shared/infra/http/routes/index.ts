import { Router } from 'express';

import authMiddleware from '../middlewares/auth.middleware';
import globalErrorHandlerMiddleware from '../middlewares/global-error-handler.middleware';
import authRouter from '../../../../modules/users/infra/http/routers/auth.router';
import checkoutHooksRouter from '../../../../modules/payments/infra/http/hooks/checkout.hooks';
import paymentRouter from '../../../../modules/payments/infra/http/routers/payment.router';
import paymentRoutes from '../../../../modules/payments/infra/http/routes/payment.routes';
import eventRouter from '../../../../modules/events/infra/http/routers/event.router';

const routes = Router();

routes.use('/health', (request, response) => {
  return response.status(200).json({ message: 'Strawberry fields forever!', timestamp: new Date().toISOString() });
});

routes.use('/auth', authRouter);
routes.use(authMiddleware);

routes.use('/events', eventRouter);
routes.use('/payment', paymentRouter);
routes.use('/payments', paymentRoutes);
routes.use('/webhooks/pix/checkout', checkoutHooksRouter);

routes.use(globalErrorHandlerMiddleware);

export default routes;
