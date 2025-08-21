import { BlogPostValidationError } from '@/types/blog';

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Array of validation errors */
  errors: BlogPostValidationError[];
  /** Warnings (non-blocking issues) */
  warnings: BlogPostValidationError[];
}

/**
 * Validation options interface
 */
export interface ValidationOptions {
  /** Whether to validate content length */
  validateContentLength?: boolean;
  /** Minimum content length in characters */
  minContentLength?: number;
  /** Maximum content length in characters */
  maxContentLength?: number;
  /** Whether to validate tag count */
  validateTagCount?: boolean;
  /** Maximum number of tags allowed */
  maxTags?: number;
  /** Whether to perform strict validation */
  strict?: boolean;
}

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: Required<ValidationOptions> = {
  validateContentLength: true,
  minContentLength: 100,
  maxContentLength: 50000,
  validateTagCount: true,
  maxTags: 10,
  strict: false,
};

/**
 * Validates if a string is a valid ISO date format
 * @param dateString - Date string to validate
 * @returns True if valid ISO date
 */
export function isValidISODate(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  // Check basic ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)
  const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
  if (!isoRegex.test(dateString)) {
    return false;
  }

  // Validate that it's a real date
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString.split('T')[0]);
}

/**
 * Validates frontmatter schema and required fields
 * @param frontmatter - Raw frontmatter object
 * @param slug - Post slug for error context
 * @returns Validation result
 */
export function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  slug: string
): ValidationResult {
  const errors: BlogPostValidationError[] = [];
  const warnings: BlogPostValidationError[] = [];

  // Check if frontmatter exists
  if (!frontmatter || typeof frontmatter !== 'object') {
    errors.push({
      field: 'frontmatter',
      message: `Post '${slug}' has no frontmatter or invalid frontmatter format`,
    });
    return { isValid: false, errors, warnings };
  }

  // Validate required fields
  const requiredFields = ['title', 'description', 'date'];
  
  for (const field of requiredFields) {
    if (!frontmatter[field]) {
      errors.push({
        field,
        message: `Required field '${field}' is missing in post '${slug}'`,
      });
    } else if (typeof frontmatter[field] !== 'string') {
      errors.push({
        field,
        message: `Field '${field}' must be a string in post '${slug}'`,
      });
    } else if (frontmatter[field].trim().length === 0) {
      errors.push({
        field,
        message: `Field '${field}' cannot be empty in post '${slug}'`,
      });
    }
  }

  // Validate title length
  if (frontmatter.title && typeof frontmatter.title === 'string') {
    if (frontmatter.title.length > 200) {
      warnings.push({
        field: 'title',
        message: `Title is very long (${frontmatter.title.length} characters) in post '${slug}'. Consider shortening for better SEO.`,
      });
    }
    if (frontmatter.title.length < 10) {
      warnings.push({
        field: 'title',
        message: `Title is very short (${frontmatter.title.length} characters) in post '${slug}'. Consider making it more descriptive.`,
      });
    }
  }

  // Validate description length
  if (frontmatter.description && typeof frontmatter.description === 'string') {
    if (frontmatter.description.length > 300) {
      warnings.push({
        field: 'description',
        message: `Description is very long (${frontmatter.description.length} characters) in post '${slug}'. Consider shortening for better SEO.`,
      });
    }
    if (frontmatter.description.length < 50) {
      warnings.push({
        field: 'description',
        message: `Description is short (${frontmatter.description.length} characters) in post '${slug}'. Consider making it more descriptive.`,
      });
    }
  }

  // Validate date format
  if (frontmatter.date) {
    if (!isValidISODate(frontmatter.date)) {
      errors.push({
        field: 'date',
        message: `Invalid date format '${frontmatter.date}' in post '${slug}'. Use ISO format (YYYY-MM-DD).`,
      });
    } else {
      // Check if date is in the future
      const postDate = new Date(frontmatter.date);
      const now = new Date();
      if (postDate > now) {
        warnings.push({
          field: 'date',
          message: `Post date '${frontmatter.date}' is in the future in post '${slug}'.`,
        });
      }
    }
  }

  // Validate tags
  if (frontmatter.tags !== undefined) {
    if (!Array.isArray(frontmatter.tags)) {
      errors.push({
        field: 'tags',
        message: `Tags must be an array in post '${slug}'`,
      });
    } else {
      // Check each tag
      frontmatter.tags.forEach((tag: unknown, index: number) => {
        if (typeof tag !== 'string') {
          errors.push({
            field: 'tags',
            message: `Tag at index ${index} must be a string in post '${slug}'`,
          });
        } else if (tag.trim().length === 0) {
          errors.push({
            field: 'tags',
            message: `Tag at index ${index} cannot be empty in post '${slug}'`,
          });
        } else if (tag.length > 50) {
          warnings.push({
            field: 'tags',
            message: `Tag '${tag}' is very long (${tag.length} characters) in post '${slug}'`,
          });
        }
      });

      // Check tag count
      if (frontmatter.tags.length > 10) {
        warnings.push({
          field: 'tags',
          message: `Post '${slug}' has many tags (${frontmatter.tags.length}). Consider reducing for better organization.`,
        });
      }

      // Check for duplicate tags
      const uniqueTags = new Set(frontmatter.tags.map((tag: string) => tag.toLowerCase()));
      if (uniqueTags.size !== frontmatter.tags.length) {
        warnings.push({
          field: 'tags',
          message: `Post '${slug}' has duplicate tags (case-insensitive).`,
        });
      }
    }
  }

  // Validate author
  if (frontmatter.author !== undefined) {
    if (typeof frontmatter.author !== 'string') {
      errors.push({
        field: 'author',
        message: `Author must be a string in post '${slug}'`,
      });
    } else if (frontmatter.author.trim().length === 0) {
      errors.push({
        field: 'author',
        message: `Author cannot be empty in post '${slug}'`,
      });
    }
  }

  // Validate published field
  if (frontmatter.published !== undefined && typeof frontmatter.published !== 'boolean') {
    errors.push({
      field: 'published',
      message: `Published field must be a boolean in post '${slug}'`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates markdown content
 * @param content - Markdown content to validate
 * @param slug - Post slug for error context
 * @param options - Validation options
 * @returns Validation result
 */
export function validateContent(
  content: string,
  slug: string,
  options: ValidationOptions = {}
): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: BlogPostValidationError[] = [];
  const warnings: BlogPostValidationError[] = [];

  // Check if content exists
  if (!content || typeof content !== 'string') {
    errors.push({
      field: 'content',
      message: `Post '${slug}' has no content`,
    });
    return { isValid: false, errors, warnings };
  }

  const trimmedContent = content.trim();

  // Validate content length
  if (opts.validateContentLength) {
    if (trimmedContent.length < opts.minContentLength) {
      errors.push({
        field: 'content',
        message: `Content is too short (${trimmedContent.length} characters, minimum ${opts.minContentLength}) in post '${slug}'`,
      });
    }
    if (trimmedContent.length > opts.maxContentLength) {
      errors.push({
        field: 'content',
        message: `Content is too long (${trimmedContent.length} characters, maximum ${opts.maxContentLength}) in post '${slug}'`,
      });
    }
  }

  // Check for basic markdown structure
  const hasHeadings = /^#{1,6}\s+.+$/m.test(content);
  if (!hasHeadings) {
    warnings.push({
      field: 'content',
      message: `Post '${slug}' has no headings. Consider adding headings for better structure.`,
    });
  }

  // Check for very long paragraphs
  const paragraphs = content.split('\n\n');
  const longParagraphs = paragraphs.filter(p => p.length > 1000);
  if (longParagraphs.length > 0) {
    warnings.push({
      field: 'content',
      message: `Post '${slug}' has ${longParagraphs.length} very long paragraph(s). Consider breaking them up for better readability.`,
    });
  }

  // Check for potential markdown syntax issues
  const unclosedCodeBlocks = (content.match(/```/g) || []).length % 2 !== 0;
  if (unclosedCodeBlocks) {
    errors.push({
      field: 'content',
      message: `Post '${slug}' has unclosed code blocks (unmatched \`\`\`)`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a complete blog post (frontmatter + content)
 * @param frontmatter - Post frontmatter
 * @param content - Post content
 * @param slug - Post slug
 * @param options - Validation options
 * @returns Combined validation result
 */
export function validateBlogPost(
  frontmatter: any,
  content: string,
  slug: string,
  options: ValidationOptions = {}
): ValidationResult {
  const frontmatterResult = validateFrontmatter(frontmatter, slug);
  const contentResult = validateContent(content, slug, options);

  return {
    isValid: frontmatterResult.isValid && contentResult.isValid,
    errors: [...frontmatterResult.errors, ...contentResult.errors],
    warnings: [...frontmatterResult.warnings, ...contentResult.warnings],
  };
}

/**
 * Formats validation errors for display
 * @param result - Validation result
 * @returns Formatted error message
 */
export function formatValidationErrors(result: ValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return 'Validation passed with no issues.';
  }

  const messages: string[] = [];

  if (result.errors.length > 0) {
    messages.push('ERRORS:');
    result.errors.forEach((error: BlogPostValidationError) => {
      messages.push(`  - ${error.field}: ${error.message}`);
    });
  }

  if (result.warnings.length > 0) {
    messages.push('WARNINGS:');
    result.warnings.forEach((warning: BlogPostValidationError) => {
      messages.push(`  - ${warning.field}: ${warning.message}`);
    });
  }

  return messages.join('\n');
}

/**
 * Creates a validation error object
 * @param field - Field name
 * @param message - Error message
 * @returns BlogPostValidationError
 */
export function createValidationError(
  field: string,
  message: string
): BlogPostValidationError {
  return { field, message };
}