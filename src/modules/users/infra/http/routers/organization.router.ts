import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import OrganizationController from '../controllers/organization.controller';

const organizationRouter = Router();
const organizationController = new OrganizationController();

organizationRouter.post(
  '/:organization_id/activities',
  celebrate({
    [Segments.PARAMS]: {
      organization_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  (request, response) => organizationController.createActivity(request, response),
);

export default organizationRouter;
