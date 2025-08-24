import { z } from 'zod';
import {
  sanitizeUserContent,
  sanitizeSearchQuery,
  sanitizeFormInput,
} from './sanitization';

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  // Basic patterns
  email:
    /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,

  // Content patterns
  noHtml: /^[^<>]*$/,
  noScript: /^(?!.*<script).*$/i,
  noSqlInjection:
    /^(?!.*(union|select|insert|update|delete|drop|create|alter|exec|execute)).*$/i,

  // Security patterns
  safeFilename: /^[a-zA-Z0-9._-]+$/,
  noPath: /^[^/\\]*$/,
};

/**
 * Search query validation schema
 */
export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(200, 'Search query too long')
    .refine(
      val => ValidationPatterns.noScript.test(val),
      'Search query contains invalid characters'
    )
    .transform(val => sanitizeSearchQuery(val)),

  category: z
    .string()
    .optional()
    .refine(
      val => !val || ValidationPatterns.slug.test(val),
      'Invalid category format'
    ),

  tags: z
    .array(z.string())
    .optional()
    .refine(
      val => !val || val.every(tag => ValidationPatterns.slug.test(tag)),
      'Invalid tag format'
    ),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  offset: z.coerce.number().int().min(0).default(0),
});

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .refine(
      val => ValidationPatterns.noHtml.test(val),
      'Name contains invalid characters'
    )
    .transform(val => sanitizeFormInput(val)),

  email: z
    .string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .refine(val => ValidationPatterns.email.test(val), 'Invalid email format')
    .refine(
      val => !val.includes('..'),
      'Email cannot contain consecutive dots'
    ),

  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject too long')
    .refine(
      val => ValidationPatterns.noHtml.test(val),
      'Subject contains invalid characters'
    )
    .transform(val => sanitizeFormInput(val)),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long')
    .refine(
      val => ValidationPatterns.noScript.test(val),
      'Message contains invalid content'
    )
    .transform(val => sanitizeUserContent(val)),

  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal(''))
    .refine(
      val => !val || ValidationPatterns.url.test(val),
      'Invalid website URL format'
    ),
});

/**
 * Comment form validation schema
 */
export const commentFormSchema = z.object({
  author: z
    .string()
    .min(2, 'Author name must be at least 2 characters')
    .max(100, 'Author name too long')
    .refine(
      val => ValidationPatterns.noHtml.test(val),
      'Author name contains invalid characters'
    )
    .transform(val => sanitizeFormInput(val)),

  email: z.string().email('Invalid email format').max(254, 'Email too long'),

  website: z.string().url('Invalid website URL').optional().or(z.literal('')),

  content: z
    .string()
    .min(5, 'Comment must be at least 5 characters')
    .max(2000, 'Comment too long')
    .refine(
      val => ValidationPatterns.noScript.test(val),
      'Comment contains invalid content'
    )
    .transform(val => sanitizeUserContent(val)),

  postSlug: z
    .string()
    .min(1, 'Post slug is required')
    .refine(
      val => ValidationPatterns.slug.test(val),
      'Invalid post slug format'
    ),
});

/**
 * Newsletter subscription validation schema
 */
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email format').max(254, 'Email too long'),

  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .optional()
    .refine(
      val => !val || ValidationPatterns.noHtml.test(val),
      'Name contains invalid characters'
    )
    .transform(val => (val ? sanitizeFormInput(val) : val)),
});

/**
 * File upload validation schema
 */
export const fileUploadSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename too long')
    .refine(
      val => ValidationPatterns.safeFilename.test(val),
      'Invalid filename format'
    )
    .refine(
      val => ValidationPatterns.noPath.test(val),
      'Filename cannot contain path separators'
    ),

  size: z
    .number()
    .int()
    .min(1, 'File size must be greater than 0')
    .max(10 * 1024 * 1024, 'File size too large (max 10MB)'),

  type: z
    .string()
    .refine(
      val =>
        [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
        ].includes(val),
      'Invalid file type'
    ),
});

/**
 * URL parameter validation schema
 */
export const urlParamsSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .refine(val => ValidationPatterns.slug.test(val), 'Invalid slug format'),

  page: z.coerce.number().int().min(1).default(1),

  category: z
    .string()
    .optional()
    .refine(
      val => !val || ValidationPatterns.slug.test(val),
      'Invalid category format'
    ),
});

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: string[];
    };

/**
 * Generic validation function
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): ValidationResult<T> {
  try {
    const result = schema.parse(input);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues?.map(err => err.message) || ['Validation failed'],
      };
    }
    return {
      success: false,
      errors: ['Validation failed'],
    };
  }
}

/**
 * Safe validation function that returns null on error
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): T | null {
  try {
    return schema.parse(input);
  } catch {
    return null;
  }
}

/**
 * Validation middleware for API routes
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (input: unknown): T => {
    const result = validateInput(schema, input);
    if (!result.success) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`);
    }
    return result.data;
  };
}

/**
 * Specific validation functions
 */
export const validateSearchQuery = (input: unknown) =>
  validateInput(searchQuerySchema, input);
export const validateContactForm = (input: unknown) =>
  validateInput(contactFormSchema, input);
export const validateCommentForm = (input: unknown) =>
  validateInput(commentFormSchema, input);
export const validateNewsletter = (input: unknown) =>
  validateInput(newsletterSchema, input);
export const validateFileUpload = (input: unknown) =>
  validateInput(fileUploadSchema, input);
export const validateUrlParams = (input: unknown) =>
  validateInput(urlParamsSchema, input);

/**
 * Safe validation functions
 */
export const safeValidateSearchQuery = (input: unknown) =>
  safeValidate(searchQuerySchema, input);
export const safeValidateContactForm = (input: unknown) =>
  safeValidate(contactFormSchema, input);
export const safeValidateCommentForm = (input: unknown) =>
  safeValidate(commentFormSchema, input);
export const safeValidateNewsletter = (input: unknown) =>
  safeValidate(newsletterSchema, input);
export const safeValidateFileUpload = (input: unknown) =>
  safeValidate(fileUploadSchema, input);
export const safeValidateUrlParams = (input: unknown) =>
  safeValidate(urlParamsSchema, input);

/**
 * Input sanitization and validation helper
 */
export function sanitizeAndValidate<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
  customSanitizer?: (val: unknown) => unknown
): ValidationResult<T> {
  try {
    // Apply custom sanitization if provided
    const sanitizedInput = customSanitizer ? customSanitizer(input) : input;

    // Validate with schema
    const result = schema.parse(sanitizedInput);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(err => err.message),
      };
    }
    return {
      success: false,
      errors: ['Sanitization and validation failed'],
    };
  }
}

/**
 * Check if string contains potentially dangerous content
 */
export function containsDangerousContent(input: string): boolean {
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /\beval\s*\(/gi,
    /\bFunction\s*\(/gi,
    /\bsetTimeout\s*\(/gi,
    /\bsetInterval\s*\(/gi,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate and sanitize user input with comprehensive checks
 */
export function validateUserInput(
  input: string,
  maxLength: number = 1000
): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];

  // Check length
  if (input.length > maxLength) {
    errors.push(`Input too long (max ${maxLength} characters)`);
  }

  // Check for dangerous content
  if (containsDangerousContent(input)) {
    errors.push('Input contains potentially dangerous content');
  }

  // Sanitize the input
  const sanitized = sanitizeUserContent(input);

  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
}
