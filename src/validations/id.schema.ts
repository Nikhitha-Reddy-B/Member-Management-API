import Joi from 'joi';

export const idSchema = Joi.number().integer().positive().required().messages({
  'number.base': '"id" must be a number',
  'number.integer': '"id" must be an integer',
  'number.positive': '"id" must be a positive number',
  'any.required': '"id" is a required field',
});
