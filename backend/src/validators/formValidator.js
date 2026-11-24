const { body, validationResult } = require('express-validator');

const VALID_FIELD_TYPES = [
  'TEXT',
  'EMAIL',
  'NUMBER',
  'PHONE',
  'TEXTAREA',
  'DATE',
  'SELECT',
  'RADIO',
  'CHECKBOX',
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateCreateForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Form name is required')
    .isLength({ min: 2, max: 120 })
    .withMessage('Form name must be between 2 and 120 characters'),
  body('mail')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid contact email address'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either "draft" or "published"'),
  body('fields')
    .optional()
    .isArray()
    .withMessage('Fields must be an array')
    .custom((fields) => {
      if (!Array.isArray(fields)) return true;
      const seenKeys = new Set();

      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        if (!f.key || typeof f.key !== 'string' || !f.key.trim()) {
          throw new Error(`Field at index ${i} is missing a valid 'key'`);
        }
        const key = f.key.trim();
        if (!/^[a-zA-Z0-9_]+$/.test(key)) {
          throw new Error(`Field key "${key}" can only contain letters, numbers, and underscores`);
        }
        if (seenKeys.has(key.toLowerCase())) {
          throw new Error(`Duplicate field key "${key}" detected. Field keys must be unique within a form.`);
        }
        seenKeys.add(key.toLowerCase());

        if (!f.label || typeof f.label !== 'string' || !f.label.trim()) {
          throw new Error(`Field "${key}" is missing a label`);
        }

        const type = (f.type || '').toUpperCase();
        if (!VALID_FIELD_TYPES.includes(type)) {
          throw new Error(`Field "${key}" has invalid type "${f.type}". Valid types: ${VALID_FIELD_TYPES.join(', ')}`);
        }

        if (['SELECT', 'RADIO', 'CHECKBOX'].includes(type)) {
          if (!Array.isArray(f.options) || f.options.length === 0) {
            throw new Error(`Field "${key}" of type ${type} must have a non-empty options array`);
          }
        }
      }
      return true;
    }),
  handleValidationErrors,
];

const validateUpdateForm = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Form name cannot be empty')
    .isLength({ min: 2, max: 120 })
    .withMessage('Form name must be between 2 and 120 characters'),
  body('mail')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid contact email address'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either "draft" or "published"'),
  body('fields')
    .optional()
    .isArray()
    .withMessage('Fields must be an array')
    .custom((fields) => {
      if (!Array.isArray(fields)) return true;
      const seenKeys = new Set();

      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        if (!f.key || typeof f.key !== 'string' || !f.key.trim()) {
          throw new Error(`Field at index ${i} is missing a valid 'key'`);
        }
        const key = f.key.trim();
        if (!/^[a-zA-Z0-9_]+$/.test(key)) {
          throw new Error(`Field key "${key}" can only contain letters, numbers, and underscores`);
        }
        if (seenKeys.has(key.toLowerCase())) {
          throw new Error(`Duplicate field key "${key}" detected. Field keys must be unique within a form.`);
        }
        seenKeys.add(key.toLowerCase());

        if (!f.label || typeof f.label !== 'string' || !f.label.trim()) {
          throw new Error(`Field "${key}" is missing a label`);
        }

        const type = (f.type || '').toUpperCase();
        if (!VALID_FIELD_TYPES.includes(type)) {
          throw new Error(`Field "${key}" has invalid type "${f.type}". Valid types: ${VALID_FIELD_TYPES.join(', ')}`);
        }

        if (['SELECT', 'RADIO', 'CHECKBOX'].includes(type)) {
          if (!Array.isArray(f.options) || f.options.length === 0) {
            throw new Error(`Field "${key}" of type ${type} must have a non-empty options array`);
          }
        }
      }
      return true;
    }),
  handleValidationErrors,
];

module.exports = {
  VALID_FIELD_TYPES,
  validateCreateForm,
  validateUpdateForm,
  handleValidationErrors,
};
