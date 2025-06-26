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

  password: Joi.string().min(8).required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.empty': `"password" cannot be an empty field`,
    'string.min': `"password" should have a minimum length of {#limit}`,
    'any.required': `"password" is a required field`
  }),

  username: Joi.string().required().messages({
    'string.base': `"username" should be a type of 'text'`,
    'string.empty': `"username" cannot be an empty field`,
    'any.required': `"username" is a required field`
  }),

  phone: Joi.string().pattern(/^[0-9+\-() ]+$/).required().messages({
    'string.pattern.base': `"phone" contains invalid characters`,
    'string.base': `"phone" should be a type of 'text'`,
    'any.required': `"phone" is a required field`
  }),

  isActive: Joi.boolean().required().messages({
    'boolean.base': `"isActive" must be a boolean`,
    'any.required': `"isActive" is a required field`
  }),

  profilePicture: Joi.string().uri().optional().allow('', null).messages({
    'string.uri': `"profilePicture" must be a valid URI`,
    'string.base': `"profilePicture" should be a type of 'text'`
  }),

  roleId: Joi.number().integer().positive().optional().messages({
    'number.base': `"roleId" must be a number`,
    'number.integer': `"roleId" must be an integer`,
    'number.positive': `"roleId" must be a positive number`,
    'any.required': `"roleId" is a required field`
  })
});
