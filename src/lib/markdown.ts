import { remark } from 'remark';
import remarkHtml from 'remark-html';
import matter from 'gray-matter';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { PostMetadata } from '@/types/blog';
import {
  validateFrontmatterWithZod,
  transformToPostMetadata,
} from './schemas/frontmatter';

// Create a JSDOM window for server-side DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window as unknown as Window & typeof globalThis);

/**
 * Configuration options for markdown processing
 */
export interface MarkdownOptions {
  /** Whether to sanitize HTML output (default: true) */
  sanitize?: boolean;
  /** Custom DOMPurify configuration */
  purifyConfig?: DOMPurify.Config;
}

/**
 * Converts markdown content to sanitized HTML.
 *
 * This function processes markdown content and converts it to HTML with security
 * measures to prevent XSS attacks through HTML sanitization using DOMPurify.
 *
 * @param markdown - Raw markdown content to convert
 * @param options - Configuration options for processing
 * @returns {Promise<string>} Sanitized HTML content
 *
 * @throws {Error} When markdown processing fails
 *
 * @example
 * ```typescript
 * const html = await markdownToHtml('# Hello World\n\nThis is **bold** text.');
 * console.log(html); // '<h1>Hello World</h1>\n<p>This is <strong>bold</strong> text.</p>'
 * ```
 *
 * @example
 * ```typescript
 * // With custom options
 * const html = await markdownToHtml(markdown, {
 *   sanitize: false, // Disable sanitization (not recommended)
 *   purifyConfig: { ALLOWED_TAGS: ['p', 'strong', 'em'] }
 * });
 * ```
 */
export async function markdownToHtml(
  markdown: string,
  options: MarkdownOptions = {}
): Promise<string> {
  try {
    const { sanitize = true, purifyConfig = {} } = options;

    // Validate input
    if (typeof markdown !== 'string') {
      throw new Error('Markdown content must be a string');
    }

    if (markdown.trim().length === 0) {
      return '';
    }

    // Process markdown to HTML
    const processedContent = await remark()
      .use(remarkHtml, { sanitize: false }) // We'll sanitize manually with DOMPurify
      .process(markdown);

    let htmlContent = processedContent.toString();

    // Sanitize HTML to prevent XSS attacks
    if (sanitize) {
      const defaultConfig = {
        ALLOWED_TAGS: [
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'p',
          'br',
          'strong',
          'em',
          'u',
          's',
          'ul',
          'ol',
          'li',
          'blockquote',
          'pre',
          'code',
          'a',
          'img',
          'table',
          'thead',
          'tbody',
          'tr',
          'th',
          'td',
        ],
        ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'class', 'id'],
        ALLOWED_URI_REGEXP:
          /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      };

      const config = { ...defaultConfig, ...purifyConfig };
      htmlContent = purify.sanitize(
        htmlContent,
        config as Parameters<typeof purify.sanitize>[1]
      ) as string;
    }

    return htmlContent;
  } catch (error) {
    throw new Error(
      `Failed to process markdown: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Result interface for frontmatter parsing
 */
export interface FrontmatterResult {
  /** Parsed and validated metadata */
  data: PostMetadata;
  /** Raw markdown content without frontmatter */
  content: string;
}

/**
 * Parses and validates frontmatter from markdown content.
 *
 * This function extracts YAML frontmatter from markdown content and validates
 * it against the PostMetadata interface. It ensures required fields are present
 * and performs type validation for better data integrity.
 *
 * @param markdownContent - Raw markdown content with YAML frontmatter
 * @returns {FrontmatterResult} Parsed and validated frontmatter data with content
 *
 * @throws {Error} When frontmatter is invalid or missing required fields
 *
 * @example
 * ```typescript
 * const markdown = `---
 * title: "My Blog Post"
 * description: "A great post about coding"
 * date: "2024-01-15"
 * tags: ["javascript", "react"]
 * ---
 * # Content here`;
 *
 * const { data: metadata, content } = parseFrontmatter(markdown);
 * console.log(metadata.title); // "My Blog Post"
 * ```
 *
 * @example
 * ```typescript
 * // Error handling
 * try {
 *   const { data, content } = parseFrontmatter(invalidMarkdown);
 * } catch (error) {
 *   console.error('Invalid frontmatter:', error.message);
 * }
 * ```
 */
export function parseFrontmatter(markdownContent: string): FrontmatterResult {
  try {
    // Validate input
    if (typeof markdownContent !== 'string') {
      throw new Error('Markdown content must be a string');
    }

    if (markdownContent.trim().length === 0) {
      throw new Error('Markdown content cannot be empty');
    }

    // Parse frontmatter using gray-matter
    const { data, content } = matter(markdownContent);

    // Validate content exists
    if (!content || content.trim().length === 0) {
      throw new Error('Markdown content body cannot be empty');
    }

    // Validate frontmatter using Zod schema
    const validationResult = validateFrontmatterWithZod(data);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      throw new Error(`Invalid frontmatter: ${errorMessages}`);
    }

    // Transform validated data to PostMetadata
    const metadata = transformToPostMetadata(validationResult.data);

    return {
      data: metadata,
      content: content.trim(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse frontmatter: ${error.message}`);
    }
    throw new Error('Failed to parse frontmatter: Unknown error');
  }
}
