import Joi from 'joi';

export const roleSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'string.min': `"name" should have a minimum length of {#limit}`,
    'any.required': `"name" is a required field`
  }),
  description: Joi.string().optional().allow('').invalid(null).messages({
    'string.base': `"description" should be a type of 'text'`,
    'any.invalid': `"description" cannot be null`
  })
});
