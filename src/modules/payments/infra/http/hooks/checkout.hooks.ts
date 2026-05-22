import { Router } from 'express';
import { HooksController } from '../controllers/hooks.controller';

const checkoutHooksRouter = Router();
const hooksController = new HooksController();

checkoutHooksRouter.post('/abacatepay', hooksController.onAbacatepay);

export default checkoutHooksRouter;
