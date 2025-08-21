import fs from 'fs';
import path from 'path';
import { PostMetadata, BlogPost, BlogPostSummary } from '@/types/blog';
import { parseFrontmatter, markdownToHtml } from './markdown';
import {
  validateBlogPost,
  formatValidationErrors,
  ValidationOptions,
} from './validation';

// Posts directory path
const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');

/**
 * Calculates estimated reading time for content
 * @param content - The text content to analyze
 * @returns Reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Validates post metadata and content using comprehensive validation
 * @param metadata - Raw metadata object
 * @param slug - Post slug for error reporting
 * @param content - Post content for calculating reading time and word count
 * @param options - Validation options
 * @returns Validated metadata as BlogPostSummary
 * @throws Error if validation fails
 */
function validatePostMetadata(
  metadata: PostMetadata,
  slug: string,
  content: string,
  options: ValidationOptions = {}
): BlogPostSummary {
  // Run comprehensive validation
  const validationResult = validateBlogPost(metadata, content, slug, options);

  // If validation fails, throw detailed error
  if (!validationResult.isValid) {
    const errorMessage = formatValidationErrors(validationResult);
    throw new Error(`Validation failed for post '${slug}':\n${errorMessage}`);
  }

  // Log warnings in development
  if (
    validationResult.warnings.length > 0 &&
    process.env.NODE_ENV === 'development'
  ) {
    // Validation warnings are available but not logged to console
  }

  // Calculate reading time and word count
  const readingTime = calculateReadingTime(content);
  const wordCount = content.trim().split(/\s+/).length;

  const result: BlogPostSummary = {
    slug,
    title: metadata.title,
    description: metadata.description,
    date: metadata.date,
    tags: metadata.tags || [],
    author: metadata.author || 'Anonymous',
    published: metadata.published !== false,
    readingTime,
    wordCount,
  };

  // Only add image if it exists
  if (metadata.image) {
    result.image = metadata.image;
  }

  return result;
}

/**
 * Retrieves all blog posts with metadata
 * @returns Promise resolving to array of BlogPostSummary
 * @throws Error if posts directory is inaccessible or posts are malformed
 */
export async function getAllPosts(): Promise<BlogPostSummary[]> {
  try {
    // Check if posts directory exists
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      return [];
    }

    // Read all files from posts directory
    const fileNames = fs.readdirSync(POSTS_DIRECTORY);

    // Filter for markdown files only
    const markdownFiles = fileNames.filter(
      fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx')
    );

    if (markdownFiles.length === 0) {
      return [];
    }

    const posts: BlogPostSummary[] = [];

    for (const fileName of markdownFiles) {
      try {
        const slug = fileName.replace(/\.(md|mdx)$/, '');
        const filePath = path.join(POSTS_DIRECTORY, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const { data: metadata, content } = parseFrontmatter(fileContent);

        const validatedMetadata = validatePostMetadata(
          metadata,
          slug,
          content,
          {
            validateContentLength: true,
            minContentLength: 50, // More lenient for blog posts
            validateTagCount: true,
            maxTags: 10,
          }
        );

        posts.push(validatedMetadata);
      } catch {
        // Continue processing other posts instead of failing completely
        continue;
      }
    }

    // Sort posts by date (newest first)
    posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return posts;
  } catch (error) {
    throw new Error(
      `Failed to retrieve posts: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Retrieves a single post by slug
 * @param slug - Post identifier
 * @returns Promise resolving to BlogPost or null if not found
 * @throws Error if post processing fails
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Validate slug input
    if (!slug || typeof slug !== 'string') {
      throw new Error('Invalid slug provided');
    }

    // Sanitize slug to prevent directory traversal
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '');

    // Check if posts directory exists
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      return null;
    }

    // Try both .md and .mdx extensions
    const possibleFiles = [`${sanitizedSlug}.md`, `${sanitizedSlug}.mdx`];
    let filePath: string | null = null;

    for (const fileName of possibleFiles) {
      const testPath = path.join(POSTS_DIRECTORY, fileName);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }

    if (!filePath) {
      return null;
    }

    // Read and process the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: metadata, content } = parseFrontmatter(fileContent);

    // Validate metadata and get summary
    const validatedSummary = validatePostMetadata(
      metadata,
      sanitizedSlug,
      content,
      {
        validateContentLength: true,
        minContentLength: 50, // More lenient for blog posts
        validateTagCount: true,
        maxTags: 10,
      }
    );

    // Convert markdown to HTML
    const htmlContent = await markdownToHtml(content);

    const blogPost: BlogPost = {
      title: validatedSummary.title,
      description: validatedSummary.description,
      date: validatedSummary.date,
      tags: validatedSummary.tags,
      author: validatedSummary.author,
      published: validatedSummary.published,
      content: htmlContent,
    };

    // Only add image if it exists
    if (validatedSummary.image) {
      blogPost.image = validatedSummary.image;
    }

    return blogPost;
  } catch (error) {
    throw new Error(
      `Failed to retrieve post '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Retrieves posts filtered by tag
 * @param tag - Tag to filter by
 * @returns Promise resolving to array of BlogPostSummary
 */
export async function getPostsByTag(tag: string): Promise<BlogPostSummary[]> {
  try {
    if (!tag || typeof tag !== 'string') {
      return [];
    }

    const allPosts = await getAllPosts();
    return allPosts.filter(post =>
      post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
    );
  } catch (error) {
    throw new Error(
      `Failed to retrieve posts by tag '${tag}': ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Retrieves all unique tags from all posts
 * @returns Promise resolving to array of unique tags
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const allPosts = await getAllPosts();
    const tagSet = new Set<string>();

    allPosts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  } catch (error) {
    throw new Error(
      `Failed to retrieve tags: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
