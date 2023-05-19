const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
  }),
  username: Joi.string().alphanum().min(3).max(10).required().messages({
    'string.empty': 'Username is required.',
    'any.required': 'Username is required.',
    'string.alphanum': 'Username must only contain alphanumeric characters.',
    'string.min': 'Username should have a minimum length of {#limit} characters.',
    'string.max': 'Username should have a maximum length of {#limit} characters.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
    'string.email': 'Invalid email address.',
  }),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).optional().messages({
        'any.required': 'Password is required.',
        'string.empty': 'Password is required.',
        'string.min': 'Password should have a minimum length of {#limit} characters.',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.',
      }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Invalid email address.',
  }),
  password: Joi.string().messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
  username: Joi.string().messages({
    'string.empty': 'Username is required.',
    'any.required': 'Username is required.',
  }),
}).or('email', 'username').messages({
  'object.missing': 'Email or username is required.',
});

const updateSchema = Joi.object({
  username: Joi.string().optional().messages({
    'string.empty': 'Username must not be empty.',
    'string.alphanum': 'Username must only contain alphanumeric characters.',
    'string.min': 'Username should have a minimum length of {#limit} characters.',
    'string.max': 'Username should have a maximum length of {#limit} characters.',
  }),
  name: Joi.string().optional().messages({
    'string.empty': 'Name must not be empty.',
  }),
  age: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Age must be a positive number.',
    'number.integer': 'Age must be an integer.',
  }),
  gender: Joi.string().valid('male', 'female', 'other').optional().messages({
    'any.only': 'Gender must be one of "male", "female", or "other".',
  }),
  avatar: Joi.string().optional().messages({
    'string.empty': 'Avatar must not be empty.',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Invalid email address.',
  }),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).optional().messages({
    'any.required': 'Password is required.',
    'string.empty': 'Password is required.',
    'string.min': 'Password should have a minimum length of {#limit} characters.',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateSchema,
};
