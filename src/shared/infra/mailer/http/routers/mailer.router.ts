import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import { MailerController } from '../controllers/mailer.controller';

const mailerRouter = Router();
const mailerController = new MailerController();

mailerRouter.post(
  '/test',
  celebrate({
    [Segments.BODY]: Joi.object({
      to: Joi.array().items(Joi.string().email()).min(1).required(),
      subject: Joi.string().required(),
      content: Joi.string().required(),
    }).required(),
  }),
  (request, response) => mailerController.sendTestEmail(request, response),
);
export { mailerRouter };
