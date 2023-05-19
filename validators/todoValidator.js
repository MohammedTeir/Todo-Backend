const Joi = require('joi');

const createTodoSchema = Joi.object({
  title: Joi.string()
    .required()
    .pattern(new RegExp('^.{3,20}$'))
    .message('Title must be between 3 and 20 characters.'),
  description: Joi.string()
    .required(),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .required(),
  dueDate: Joi.date().required(),
  category: Joi.string()
    .valid('work', 'personal', 'shopping', 'health', 'study', 'other')
    .required(),
});

const updateSchema = Joi.object({
  title: Joi.string()
    .optional()
    .pattern(new RegExp('^.{3,20}$'))
    .message('Title must be between 3 and 20.'),
  description: Joi.string()
    .optional(),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional(),
  dueDate: Joi.date()
    .optional(),
  category: Joi.string()
    .valid('work', 'personal', 'shopping', 'health', 'study', 'other')
    .optional(),
}).min(1);

const categoryTodosSchema = Joi.object({
  category: Joi.string()
    .valid('work', 'personal', 'shopping', 'health', 'study', 'other')
    .required(),
});

const priorityTodosSchema = Joi.object({
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .required(),
});

module.exports = {
  createTodoSchema,
  updateSchema,
  categoryTodosSchema,
  priorityTodosSchema,
};
