import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { OrganizationController } from '../controllers/organization.controller';

const organizationConfigurationSchema = Joi.object({
  max_batch_base_quantity: Joi.number().integer().min(1),
  can_edit_event_after_publish: Joi.boolean(),
  can_create_batches_after_publish: Joi.boolean(),
  can_create_event_activities_after_publish: Joi.boolean(),
  can_update_event_activities_after_publish: Joi.boolean(),
  can_create_event_activity_invited_after_publish: Joi.boolean(),
  can_update_event_activity_invited_after_publish: Joi.boolean(),
  can_delete_event_activity_invited_after_publish: Joi.boolean(),
});

const organizationController = new OrganizationController();
const organizationRouter = Router();

organizationRouter.get(
  '/:organization_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      organization_id: Joi.string().uuid().required(),
    }),
  }),
  (request, response) => organizationController.find(request, response),
);

organizationRouter.patch(
  '/:organization_id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      organization_id: Joi.string().uuid().required(),
    }),
    [Segments.BODY]: Joi.object({
      configuration: organizationConfigurationSchema.min(1),
    })
      .min(1)
      .required(),
  }),
  (request, response) => organizationController.update(request, response),
);
export { organizationRouter };
