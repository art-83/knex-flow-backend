import { Router } from 'express';
import globalErrorHandlerMiddleware from '../middlewares/global-error-handler.middleware';

const routes = Router();

routes.use(globalErrorHandlerMiddleware);

routes.use('/health', (request, response) => {
  return response.status(200).json({ message: 'Strawberry fields forever!' });
});

export default routes;
