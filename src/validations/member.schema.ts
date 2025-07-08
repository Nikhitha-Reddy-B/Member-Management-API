import * as Joi from 'joi';

export const memberSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': `"name" should be text`,
      'string.empty': `"name" cannot be empty`,
      'string.min': `"name" should be at least {#limit} characters`,
      'any.required': `"name" is required`,
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': `"email" should be text`,
      'string.empty': `"email" cannot be empty`,
      'string.email': `"email" must be a valid email address`,
      'any.required': `"email" is required`,
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.base': `"password" should be text`,
      'string.empty': `"password" cannot be empty`,
      'string.min': `"password" should be at least {#limit} characters`,
      'any.required': `"password" is required`,
    }),

  username: Joi.string()
    .required()
    .messages({
      'string.base': `"username" should be text`,
      'string.empty': `"username" cannot be empty`,
      'any.required': `"username" is required`,
    }),

  phone: Joi.string()
    .pattern(/^[0-9+\-() ]+$/)
    .required()
    .messages({
      'string.base': `"phone" should be text`,
      'string.empty': `"phone" cannot be empty`,
      'string.pattern.base': `"phone" contains invalid characters`,
      'any.required': `"phone" is required`,
    }),

  isActive: Joi.boolean()
    .required()
    .messages({
      'boolean.base': `"isActive" must be true or false`,
      'any.required': `"isActive" is required`,
    }),

  profilePicture: Joi.string()
    .trim()
    .uri()
    .optional()
    .allow('', null)
    .messages({
      'string.base': `"profilePicture" should be text`,
      'string.uri': `"profilePicture" must be a valid URL`,
    }),

  roleId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': `"roleId" must be a number`,
      'number.integer': `"roleId" must be an integer`,
      'number.positive': `"roleId" must be a positive number`,
    }),
});
