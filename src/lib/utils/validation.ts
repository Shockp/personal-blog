/**
 * Validation utility functions with type safety
 */

import type { ValidationResult } from '@/types/common';

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates a URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a phone number (US format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned) && cleaned.length >= 10;
}

/**
 * Validates a credit card number using Luhn algorithm
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validates a password strength
 */
export function validatePasswordStrength(
  password: string
): ValidationResult & { strength: 'weak' | 'medium' | 'strong' } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    warnings.push('Consider adding special characters for stronger security');
  }

  if (password.length < 12) {
    warnings.push('Consider using a longer password for better security');
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (errors.length === 0) {
    if (password.length >= 12 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    strength,
  };
}

/**
 * Validates a required field
 */
export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Validates minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Validates maximum length
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * Validates if value is within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates if value matches a pattern
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Validates if value is a valid date
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Validates if date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Validates if date is in the past
 */
export function isPastDate(date: Date): boolean {
  return date < new Date();
}

/**
 * Validates if value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Validates if value is a positive number
 */
export function isPositiveNumber(value: number): boolean {
  return isValidNumber(value) && value > 0;
}

/**
 * Validates if value is a non-negative number
 */
export function isNonNegativeNumber(value: number): boolean {
  return isValidNumber(value) && value >= 0;
}

/**
 * Validates if value is an integer
 */
export function isInteger(value: number): boolean {
  return isValidNumber(value) && Number.isInteger(value);
}

/**
 * Validates if string contains only alphabetic characters
 */
export function isAlphabetic(value: string): boolean {
  return /^[a-zA-Z]+$/.test(value);
}

/**
 * Validates if string contains only alphanumeric characters
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

/**
 * Validates if string is a valid hex color
 */
export function isValidHexColor(value: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
}

/**
 * Validates if string is a valid slug
 */
export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

/**
 * Validates if array has unique values
 */
export function hasUniqueValues<T>(array: T[]): boolean {
  return new Set(array).size === array.length;
}

/**
 * Validates if object has required properties
 */
export function hasRequiredProperties<T extends object>(
  obj: T,
  requiredProps: (keyof T)[]
): boolean {
  return requiredProps.every(prop => prop in obj && obj[prop] !== undefined);
}

/**
 * Creates a validation function that checks multiple conditions
 */
export function createValidator<T>(
  validators: Array<{
    validate: (value: T) => boolean;
    message: string;
  }>
): (value: T) => ValidationResult {
  return (value: T) => {
    const errors: string[] = [];

    for (const validator of validators) {
      if (!validator.validate(value)) {
        errors.push(validator.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };
}

/**
 * Validates form data against a schema
 */
export function validateFormData<T extends Record<string, unknown>>(
  data: T,
  schema: Record<keyof T, (value: T[keyof T]) => ValidationResult>
): {
  isValid: boolean;
  errors: Partial<Record<keyof T, string[]>>;
  fieldErrors: Partial<Record<keyof T, string>>;
} {
  const errors: Partial<Record<keyof T, string[]>> = {};
  const fieldErrors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(schema)) {
    const fieldKey = field as keyof T;
    const result = validator(data[fieldKey]);

    if (!result.isValid) {
      errors[fieldKey] = result.errors;
      fieldErrors[fieldKey] = result.errors[0]; // First error for display
      isValid = false;
    }
  }

  return { isValid, errors, fieldErrors };
}

/**
 * Sanitizes a string by removing potentially harmful characters
 */
export function sanitizeString(value: string): string {
  return value
    .replace(/[<>"'&]/g, '') // Remove HTML/XML characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validates and sanitizes user input
 */
export function validateAndSanitize(
  value: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    sanitize?: boolean;
  } = {}
): ValidationResult & { sanitizedValue: string } {
  const errors: string[] = [];
  const sanitizedValue = options.sanitize ? sanitizeString(value) : value;

  if (options.required && !isRequired(sanitizedValue)) {
    errors.push('This field is required');
  }

  if (options.minLength && !hasMinLength(sanitizedValue, options.minLength)) {
    errors.push(`Must be at least ${options.minLength} characters long`);
  }

  if (options.maxLength && !hasMaxLength(sanitizedValue, options.maxLength)) {
    errors.push(`Must be no more than ${options.maxLength} characters long`);
  }

  if (options.pattern && !matchesPattern(sanitizedValue, options.pattern)) {
    errors.push('Invalid format');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue,
  };
}
