import Joi from 'joi';

export const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.base': `"title" should be a type of 'text'`,
    'string.empty': `"title" cannot be empty`,
    'string.min': `"title" should have at least 3 characters`,
    'string.max': `"title" should not exceed 100 characters`,
    'any.required': `"title" is a required field`
  }),

  description: Joi.string().required().custom((value, helpers) => {
    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount > 300) {
      return helpers.error('description.maxWords');
    }
    return value;
  }).messages({
    'string.base': `"description" should be a type of 'text'`,
    'string.empty': `"description" cannot be empty`,
    'any.required': `"description" is a required field`,
    'description.maxWords': 'Description must not exceed 300 words',
  }),

  status: Joi.string()
  .custom((value, helpers) => {
    if (!['todo', 'inprogress', 'done'].includes(value)) {
      return 'todo';
    }
    return value;
  })
  .default('todo')
  .messages({
    'string.base': `"status" should be a type of 'text'`,
  }),

  assignee: Joi.number().integer().positive().required().messages({
    'number.base': `"assignee" must be a valid member ID`,
    'number.integer': `"assignee" must be an integer`,
    'number.positive': `"assignee" must be positive`,
    'any.required': `"assignee" is required`
  }),

  reporter: Joi.number().integer().positive().optional().messages({
    'number.base': `"reporter" must be a valid member ID`,
    'number.integer': `"reporter" must be an integer`,
    'number.positive': `"reporter" must be positive`
  }),

  startDate: Joi.date().required().messages({
    'date.base': `"startDate" must be a valid date`,
    'any.required': `"startDate" is required`
  }),

  endDate: Joi.date().required().messages({
    'date.base': `"endDate" must be a valid date`,
    'any.required': `"endDate" is required`
  }),
});

export const taskSchemaForUpdate = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid('todo', 'inprogress', 'done').optional(),
  assignee: Joi.number().integer().positive().optional(),
  reporter: Joi.number().integer().positive().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional()
});