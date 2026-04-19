import { Router } from 'express';
import globalErrorHandlerMiddleware from '../middlewares/global-error-handler.middleware';
import paymentRoutes from '../../../../modules/payments/infra/http/routes/payment.routes';

const routes = Router();

routes.use('/payments', paymentRoutes);

routes.use(globalErrorHandlerMiddleware);

routes.use('/health', (request, response) => {
  return response.status(200).json({ message: 'Strawberry fields forever!' });
});

export default routes;
