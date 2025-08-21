import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { rehype } from 'rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import matter from 'gray-matter';
import { getReadingTime } from './utils';

/**
 * Interface for markdown frontmatter data
 */
export interface MarkdownFrontmatter {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  author?: string;
  image?: string;
  published?: boolean;
  [key: string]: any;
}

/**
 * Interface for processed markdown content
 */
export interface ProcessedMarkdown {
  content: string;
  frontmatter: MarkdownFrontmatter;
  readingTime: number;
  wordCount: number;
}

/**
 * Processes raw markdown content and extracts frontmatter.
 * 
 * This function parses markdown content with YAML frontmatter,
 * processes the markdown to HTML, and calculates reading statistics.
 * 
 * @param markdownContent - Raw markdown content with frontmatter
 * @returns {Promise<ProcessedMarkdown>} Processed markdown data
 * 
 * @example
 * ```typescript
 * const markdown = `---
 * title: "My Post"
 * date: "2024-01-15"
 * ---
 * # Hello World
 * This is my post content.`;
 * 
 * const processed = await processMarkdown(markdown);
 * console.log(processed.frontmatter.title); // "My Post"
 * ```
 */
export async function processMarkdown(markdownContent: string): Promise<ProcessedMarkdown> {
  // Parse frontmatter and content
  const { data: frontmatter, content: rawContent } = matter(markdownContent);
  
  // Validate required frontmatter fields
  if (!frontmatter.title || !frontmatter.description || !frontmatter.date) {
    throw new Error('Missing required frontmatter fields: title, description, or date');
  }
  
  // Process markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown support
    .use(remarkHtml, { sanitize: false }) // Convert to HTML
    .process(rawContent);
  
  // Further process HTML for syntax highlighting and enhancements
  const finalContent = await rehype()
    .data('settings', { fragment: true })
    .use(rehypeHighlight) // Syntax highlighting
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['heading-link'],
        ariaLabel: 'Link to this heading'
      }
    })
    .process(processedContent.toString());
  
  // Calculate reading statistics
  const wordCount = rawContent.trim().split(/\s+/).length;
  const readingTime = getReadingTime(rawContent);
  
  return {
    content: finalContent.toString(),
    frontmatter: frontmatter as MarkdownFrontmatter,
    readingTime,
    wordCount
  };
}

/**
 * Extracts and validates frontmatter from markdown content.
 * 
 * @param markdownContent - Raw markdown content with frontmatter
 * @returns {MarkdownFrontmatter} Extracted frontmatter data
 * 
 * @example
 * ```typescript
 * const frontmatter = extractFrontmatter(markdownContent);
 * console.log(frontmatter.title);
 * ```
 */
export function extractFrontmatter(markdownContent: string): MarkdownFrontmatter {
  const { data } = matter(markdownContent);
  
  // Validate required fields
  if (!data.title || !data.description || !data.date) {
    throw new Error('Missing required frontmatter fields: title, description, or date');
  }
  
  return data as MarkdownFrontmatter;
}

/**
 * Extracts plain text content from markdown (removes formatting).
 * 
 * @param markdownContent - Raw markdown content
 * @returns {string} Plain text content
 * 
 * @example
 * ```typescript
 * const plainText = extractPlainText('# Hello\n\nThis is **bold** text.');
 * console.log(plainText); // "Hello This is bold text."
 * ```
 */
export function extractPlainText(markdownContent: string): string {
  // Remove frontmatter
  const { content } = matter(markdownContent);
  
  // Remove markdown formatting
  return content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images, keep alt text
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Generates a table of contents from markdown content.
 * 
 * @param markdownContent - Raw markdown content
 * @returns {Array<{level: number, text: string, slug: string}>} Table of contents entries
 * 
 * @example
 * ```typescript
 * const toc = generateTableOfContents(markdownContent);
 * toc.forEach(entry => {
 *   console.log(`${'  '.repeat(entry.level - 1)}${entry.text}`);
 * });
 * ```
 */
export function generateTableOfContents(markdownContent: string): Array<{
  level: number;
  text: string;
  slug: string;
}> {
  const { content } = matter(markdownContent);
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: Array<{ level: number; text: string; slug: string }> = [];
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    if (!match[1] || !match[2]) continue;
    const level = match[1].length;
    const text = match[2].trim();
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    toc.push({ level, text, slug });
  }
  
  return toc;
}

/**
 * Validates markdown frontmatter against required schema.
 * 
 * @param frontmatter - Frontmatter object to validate
 * @returns {boolean} True if valid, throws error if invalid
 * 
 * @example
 * ```typescript
 * try {
 *   validateFrontmatter(frontmatter);
 *   console.log('Frontmatter is valid');
 * } catch (error) {
 *   console.error('Invalid frontmatter:', error.message);
 * }
 * ```
 */
export function validateFrontmatter(frontmatter: any): boolean {
  const requiredFields = ['title', 'description', 'date'];
  const missingFields = requiredFields.filter(field => !frontmatter[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required frontmatter fields: ${missingFields.join(', ')}`);
  }
  
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(frontmatter.date)) {
    throw new Error('Date must be in YYYY-MM-DD format');
  }
  
  // Validate published field if present
  if (frontmatter.published !== undefined && typeof frontmatter.published !== 'boolean') {
    throw new Error('Published field must be a boolean');
  }
  
  return true;
}