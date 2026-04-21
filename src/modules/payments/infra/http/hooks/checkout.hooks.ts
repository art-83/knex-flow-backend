import { Router } from 'express';
import { HooksController } from '../controllers/hooks.controller';

const checkoutHooksRouter = Router();
const hooksController = new HooksController();

checkoutHooksRouter.post('/event', hooksController.onAny);
checkoutHooksRouter.post('/completed', hooksController.onCompleted);
checkoutHooksRouter.post('/refunded', hooksController.onRefunded);
checkoutHooksRouter.post('/disputed', hooksController.onDisputed);
checkoutHooksRouter.post('/lost', hooksController.onLost);

export default checkoutHooksRouter;
