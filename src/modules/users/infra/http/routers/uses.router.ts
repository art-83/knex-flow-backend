import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';

const usesRouter = Router();
const usersController = new UsersController();

usesRouter.get('/me', (request, response) => usersController.me(request, response));
export { usesRouter };
