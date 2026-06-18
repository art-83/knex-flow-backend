import { Joi } from 'celebrate';

const eventAddressSchema = Joi.object({
  street: Joi.string().trim().min(1).required(),
  number: Joi.string().trim().min(1).required(),
  city: Joi.string().trim().min(1).required(),
  state: Joi.string().trim().length(2).required(),
  country: Joi.string().trim().min(1).required(),
  zip_code: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      const digits = value.replace(/\D/g, '');

      if (digits.length !== 8) {
        return helpers.error('any.invalid');
      }

      return value;
    }),
});
export { eventAddressSchema };
