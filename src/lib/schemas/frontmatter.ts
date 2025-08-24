import { z } from 'zod';
import { PostMetadata } from '@/types/blog';

/**
 * Zod schema for validating blog post frontmatter
 * Provides type-safe validation with detailed error messages
 */
export const frontmatterSchema = z.object({
  /** Post title - required, non-empty string with length constraints */
  title: z
    .string({
      message: 'Title must be a string',
    })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or less')
    .refine(
      (title) => title.trim().length >= 10,
      'Title should be at least 10 characters for better SEO'
    ),

  /** Post description - required, non-empty string with length constraints */
  description: z
    .string({
      message: 'Description must be a string',
    })
    .min(1, 'Description cannot be empty')
    .max(300, 'Description must be 300 characters or less')
    .refine(
      (desc) => desc.trim().length >= 50,
      'Description should be at least 50 characters for better SEO'
    ),

  /** Publication date - required, valid ISO date string */
  date: z
    .string({
      message: 'Date must be a string',
    })
    .regex(
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/,
      'Date must be in ISO format (YYYY-MM-DD or full ISO string)'
    )
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
      },
      'Date must be a valid date'
    ),

  /** Tags array - optional, array of non-empty strings */
  tags: z
    .array(
      z
        .string({
          message: 'Each tag must be a string',
        })
        .min(1, 'Tags cannot be empty')
        .max(50, 'Each tag must be 50 characters or less')
        .refine(
          (tag) => tag.trim().length > 0,
          'Tags cannot contain only whitespace'
        )
    )
    .max(10, 'Maximum 10 tags allowed')
    .refine(
      (tags) => {
        const uniqueTags = new Set(tags.map(tag => tag.toLowerCase()));
        return uniqueTags.size === tags.length;
      },
      'Tags must be unique (case-insensitive)'
    )
    .optional()
    .default([]),

  /** Author name - optional, non-empty string */
  author: z
    .string({
      message: 'Author must be a string',
    })
    .min(1, 'Author cannot be empty')
    .max(100, 'Author name must be 100 characters or less')
    .optional(),

  /** Featured image URL - optional, non-empty string */
  image: z
    .string({
      message: 'Image must be a string',
    })
    .min(1, 'Image URL cannot be empty')
    .optional(),

  /** Publication status - optional, boolean */
  published: z
    .boolean({
      message: 'Published must be a boolean',
    })
    .optional()
    .default(true),

  /** Reading time in minutes - optional, positive number */
  readingTime: z
    .number({
      message: 'Reading time must be a number',
    })
    .positive('Reading time must be positive')
    .optional(),

  /** Word count - optional, positive integer */
  wordCount: z
    .number({
      message: 'Word count must be a number',
    })
    .int('Word count must be an integer')
    .positive('Word count must be positive')
    .optional(),
});

/**
 * Strict frontmatter schema that requires all optional fields
 * Used for comprehensive validation in production environments
 */
export const strictFrontmatterSchema = frontmatterSchema.required({
  author: true,
  image: true,
});

/**
 * Type inference from the frontmatter schema
 */
export type FrontmatterInput = z.input<typeof frontmatterSchema>;
export type FrontmatterOutput = z.output<typeof frontmatterSchema>;

/**
 * Validates frontmatter data using Zod schema
 * @param data - Raw frontmatter data to validate
 * @param strict - Whether to use strict validation (requires all fields)
 * @returns Validation result with parsed data or errors
 */
export function validateFrontmatterWithZod(
  data: unknown,
  strict: boolean = false
) {
  const schema = strict ? strictFrontmatterSchema : frontmatterSchema;
  return schema.safeParse(data);
}

/**
 * Transforms validated frontmatter to PostMetadata interface
 * @param validatedData - Zod-validated frontmatter data
 * @returns PostMetadata object
 */
export function transformToPostMetadata(
  validatedData: FrontmatterOutput
): PostMetadata {
  const result: PostMetadata = {
    title: validatedData.title.trim(),
    description: validatedData.description.trim(),
    date: validatedData.date,
    tags: validatedData.tags || [],
  };

  // Only add optional properties if they have values
  if (validatedData.author) {
    result.author = validatedData.author.trim();
  }
  if (validatedData.image) {
    result.image = validatedData.image.trim();
  }
  if (validatedData.published !== undefined) {
    result.published = validatedData.published;
  }

  return result;
}

/**
 * Content validation schema for markdown content
 */
export const contentSchema = z
  .string({
    message: 'Content must be a string',
  })
  .min(100, 'Content must be at least 100 characters')
  .max(50000, 'Content must be 50,000 characters or less')
  .refine(
    (content) => content.trim().length > 0,
    'Content cannot be empty or only whitespace'
  )
  .refine(
    (content) => {
      // Check for unclosed code blocks
      const codeBlockMatches = content.match(/```/g) || [];
      return codeBlockMatches.length % 2 === 0;
    },
    'Content has unclosed code blocks (unmatched ```)'
  );

/**
 * Complete blog post validation schema
 */
export const blogPostSchema = z.object({
  frontmatter: frontmatterSchema,
  content: contentSchema,
});

/**
 * Validates complete blog post data
 * @param data - Blog post data with frontmatter and content
 * @param strict - Whether to use strict validation
 * @returns Validation result
 */
export function validateBlogPostWithZod(
  data: { frontmatter: unknown; content: unknown },
  strict: boolean = false
) {
  const schema = z.object({
    frontmatter: strict ? strictFrontmatterSchema : frontmatterSchema,
    content: contentSchema,
  });
  
  return schema.safeParse(data);
}