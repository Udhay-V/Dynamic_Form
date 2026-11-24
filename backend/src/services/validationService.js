/**
 * Dynamic Form Validation Service
 * Validates submitted data against the Form Definition stored in DB.
 * Independent of frontend validation.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

/**
 * Normalizes options list from various formats:
 * - ["Male", "Female", "Other"]
 * - [{ label: "Male", value: "male" }, ...]
 * Returns array of string values: ["Male", "Female", "Other"] or ["male", ...]
 */
const extractOptionValues = (options) => {
  if (!Array.isArray(options)) return [];
  return options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return String(opt.value !== undefined ? opt.value : opt.label).trim();
    }
    return String(opt).trim();
  });
};

/**
 * Validates submitted data against form field definitions
 * @param {Array} fields - Array of field definitions from Form.fields
 * @param {Object} submittedData - Object containing key-value pairs submitted by user
 * @returns {Object} { isValid: boolean, errors: Object, sanitizedData: Object }
 */
const validateSubmission = (fields = [], submittedData = {}) => {
  const errors = {};
  const sanitizedData = {};

  if (!Array.isArray(fields) || fields.length === 0) {
    return {
      isValid: true,
      errors: {},
      sanitizedData: submittedData,
    };
  }

  for (const field of fields) {
    const key = field.key;
    const label = field.label || key;
    const type = (field.type || 'TEXT').toUpperCase();
    const isRequired = Boolean(field.required);
    const rawValue = submittedData[key];

    // 1. Required Check
    const isNullOrUndefined = rawValue === undefined || rawValue === null;
    const isEmptyString = typeof rawValue === 'string' && rawValue.trim() === '';
    const isEmptyArray = Array.isArray(rawValue) && rawValue.length === 0;

    if (isNullOrUndefined || isEmptyString || isEmptyArray) {
      if (isRequired) {
        errors[key] = `${label} is required.`;
      }
      continue; // Move to next field if empty and optional
    }

    // 2. Type-Specific Validation and Sanitization
    switch (type) {
      case 'TEXT':
      case 'TEXTAREA': {
        const strVal = String(rawValue).trim();
        const minLength = field.validation?.minLength ?? field.minLength;
        const maxLength = field.validation?.maxLength ?? field.maxLength;

        if (minLength !== undefined && strVal.length < Number(minLength)) {
          errors[key] = `${label} must be at least ${minLength} characters.`;
        } else if (maxLength !== undefined && strVal.length > Number(maxLength)) {
          errors[key] = `${label} must not exceed ${maxLength} characters.`;
        } else {
          sanitizedData[key] = strVal;
        }
        break;
      }

      case 'EMAIL': {
        const emailVal = String(rawValue).trim();
        if (!EMAIL_REGEX.test(emailVal)) {
          errors[key] = `Please enter a valid email address for ${label}.`;
        } else {
          sanitizedData[key] = emailVal.toLowerCase();
        }
        break;
      }

      case 'PASSWORD': {
        const pwdVal = String(rawValue);
        const minLength = Number(field.validation?.minLength ?? field.minLength ?? 6);
        const maxLength = field.validation?.maxLength ?? field.maxLength;
        const requireStrong = Boolean(field.validation?.requireStrong);

        if (pwdVal.length < minLength) {
          errors[key] = `${label} must be at least ${minLength} characters.`;
        } else if (maxLength !== undefined && pwdVal.length > Number(maxLength)) {
          errors[key] = `${label} must not exceed ${maxLength} characters.`;
        } else if (requireStrong) {
          const hasUpper = /[A-Z]/.test(pwdVal);
          const hasLower = /[a-z]/.test(pwdVal);
          const hasDigit = /[0-9]/.test(pwdVal);
          const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwdVal);
          if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            errors[key] = `${label} must include uppercase, lowercase, number, and special character.`;
          } else {
            sanitizedData[key] = pwdVal;
          }
        } else {
          sanitizedData[key] = pwdVal;
        }
        break;
      }

      case 'NUMBER': {
        const numVal = Number(rawValue);
        if (isNaN(numVal) || typeof rawValue === 'boolean') {
          errors[key] = `${label} must be a valid number.`;
        } else {
          const min = field.validation?.min ?? field.min;
          const max = field.validation?.max ?? field.max;

          if (min !== undefined && numVal < Number(min)) {
            errors[key] = `${label} must be at least ${min}.`;
          } else if (max !== undefined && numVal > Number(max)) {
            errors[key] = `${label} must not exceed ${max}.`;
          } else {
            sanitizedData[key] = numVal;
          }
        }
        break;
      }

      case 'PHONE': {
        const phoneVal = String(rawValue).trim();
        if (!PHONE_REGEX.test(phoneVal)) {
          errors[key] = `Please enter a valid phone number for ${label}.`;
        } else {
          sanitizedData[key] = phoneVal;
        }
        break;
      }

      case 'DATE': {
        const dateStr = String(rawValue).trim();
        const parsedDate = Date.parse(dateStr);
        if (isNaN(parsedDate)) {
          errors[key] = `${label} must be a valid date.`;
        } else {
          sanitizedData[key] = new Date(parsedDate).toISOString().split('T')[0];
        }
        break;
      }

      case 'SELECT':
      case 'RADIO': {
        const valStr = String(rawValue).trim();
        const allowedValues = extractOptionValues(field.options);

        // Case-insensitive match check
        const match = allowedValues.find(
          (opt) => opt.toLowerCase() === valStr.toLowerCase()
        );

        if (allowedValues.length > 0 && !match) {
          errors[key] = `Invalid option selected for ${label}. Allowed values: ${allowedValues.join(', ')}`;
        } else {
          sanitizedData[key] = match || valStr;
        }
        break;
      }

      case 'CHECKBOX': {
        const allowedValues = extractOptionValues(field.options);

        if (Array.isArray(rawValue)) {
          // Multi-option checkbox
          const selectedItems = rawValue.map((v) => String(v).trim());
          const invalidItems = selectedItems.filter(
            (item) => !allowedValues.some((opt) => opt.toLowerCase() === item.toLowerCase())
          );

          if (allowedValues.length > 0 && invalidItems.length > 0) {
            errors[key] = `Invalid selection in ${label}: ${invalidItems.join(', ')}`;
          } else {
            sanitizedData[key] = selectedItems;
          }
        } else if (typeof rawValue === 'boolean' || rawValue === 'true' || rawValue === 'false') {
          // Single toggle checkbox
          sanitizedData[key] = rawValue === true || rawValue === 'true';
        } else {
          // Single value string matching one option
          const valStr = String(rawValue).trim();
          const match = allowedValues.find(
            (opt) => opt.toLowerCase() === valStr.toLowerCase()
          );
          if (allowedValues.length > 0 && !match) {
            errors[key] = `Invalid option selected for ${label}.`;
          } else {
            sanitizedData[key] = match ? [match] : [valStr];
          }
        }
        break;
      }

      default: {
        // Fallback for custom or unknown field types
        sanitizedData[key] = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

module.exports = {
  validateSubmission,
  extractOptionValues,
};
