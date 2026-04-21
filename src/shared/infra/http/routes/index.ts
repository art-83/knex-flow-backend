import { Router } from 'express';
import globalErrorHandlerMiddleware from '../middlewares/global-error-handler.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import authRouter from '../../../../modules/users/infra/http/routers/auth.router';

const routes = Router();

routes.use('/health', (request, response) => {
  return response.status(200).json({ message: 'Strawberry fields forever!' });
});

routes.use('/auth', authRouter);
routes.use(authMiddleware);
routes.use(globalErrorHandlerMiddleware);

export default routes;
