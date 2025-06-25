import Joi from 'joi';

export const idSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'number.base': `"id" should be a number`,
    'number.integer': `"id" must be an integer`,
    'any.required': `"id" is a required parameter`
  })
});
