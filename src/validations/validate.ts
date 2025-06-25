import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (
  schema: Joi.ObjectSchema,
  property: 'body' | 'params' | 'query' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ errors });
    }

    next();
  };
};
