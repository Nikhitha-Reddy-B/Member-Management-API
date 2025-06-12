import Joi from 'joi';

export const memberSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'string.min': `"name" should have a minimum length of {#limit}`,
    'any.required': `"name" is a required field`
  }),

  email: Joi.string().email().required().messages({
    'string.email': `"email" must be a valid email`,
    'any.required': `"email" is a required field`
  }),

  password: Joi.string().min(6).required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.empty': `"password" cannot be an empty field`,
    'string.min': `"password" should have a minimum length of {#limit}`,
    'any.required': `"password" is a required field`
  }),

  roleId: Joi.number().integer().positive().optional().messages({
    'number.base': `"roleId" must be a number`,
    'number.integer': `"roleId" must be an integer`,
    'number.positive': `"roleId" must be a positive number`
  })
});
