import { Request, Response, NextFunction } from 'express';
import Joi, { Schema, ValidationErrorItem } from 'joi';

export const USER_ID_LENGTH = 6;

export const userSchema: Schema = Joi.object().keys({
  id: Joi.string().length(USER_ID_LENGTH).required(),
  login: Joi.string().required(),
  password: Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, 'validation, must contain a letter and a number').required(),
  age: Joi.number().integer().min(3).max(130).required(),
  isDeleted: Joi.boolean().required()
})

const errorResponse = (schemaErrors: ValidationErrorItem[]) => {
  const errors = schemaErrors.map(({path, message}) => {
    return { path: message}
  })

  return { 
    status: 'Failed',
    errors
  }
}

export const validateSchema = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: true,
      allowUnknown: false
    });

    if (error && error.isJoi) {
      return res.status(400).json(errorResponse(error.details))
    }

    next();
  }
} 