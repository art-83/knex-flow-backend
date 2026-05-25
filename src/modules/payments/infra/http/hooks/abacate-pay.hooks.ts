import { Router } from 'express';
import { HooksController } from '../controllers/hooks.controller';
import { validateAbacatePayHeaderMiddleware } from '../../../utils/validate-abacate-pay-header.middleware';

const checkoutHooksRouter = Router();
const hooksController = new HooksController();

checkoutHooksRouter.post('/abacatepay', validateAbacatePayHeaderMiddleware, hooksController.onAbacatepay);

export default checkoutHooksRouter;
