import fs from 'fs';
import path from 'path';
import { markdownToHtml, parseFrontmatter } from './markdown';

/**
 * Interface for a blog post with metadata
 */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  image?: string;
  published: boolean;
  content: string;
  readingTime: number;
  wordCount: number;
}

/**
 * Interface for blog post summary (without full content)
 */
export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  image?: string;
  published: boolean;
  readingTime: number;
  wordCount: number;
}

/**
 * The directory where blog posts are stored
 */
const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');

/**
 * Retrieves all blog post files from the posts directory.
 * 
 * @returns {string[]} Array of markdown file names
 * 
 * @example
 * ```typescript
 * const postFiles = getPostFiles();
 * console.log(postFiles); // ['my-first-post.md', 'another-post.md']
 * ```
 */
export function getPostFiles(): string[] {
  try {
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      console.warn(`Posts directory does not exist: ${POSTS_DIRECTORY}`);
      return [];
    }
    
    return fs
      .readdirSync(POSTS_DIRECTORY)
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)); // Sort by filename descending
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

/**
 * Reads and processes a single blog post by filename.
 * 
 * @param filename - The markdown filename (with or without .md extension)
 * @returns {Promise<BlogPost>} The processed blog post
 * 
 * @example
 * ```typescript
 * const post = await getPostByFilename('my-first-post.md');
 * console.log(post.title);
 * ```
 */
export async function getPostByFilename(filename: string): Promise<BlogPost> {
  const fullPath = path.join(POSTS_DIRECTORY, filename.endsWith('.md') ? filename : `${filename}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post file not found: ${filename}`);
  }
  
  try {
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const frontmatter = parseFrontmatter(fileContent);
    const htmlContent = await markdownToHtml(fileContent.split('---').slice(2).join('---').trim());
    
    // Calculate reading time and word count
    const wordCount = fileContent.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Generate slug from filename (remove .md extension)
    const slug = filename.replace(/\.md$/, '');
    
    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      tags: frontmatter.tags || [],
      author: frontmatter.author || 'Anonymous',
      ...(frontmatter.image && { image: frontmatter.image }),
      published: frontmatter.published !== false,
      content: htmlContent,
      readingTime,
      wordCount,
    };
  } catch (error) {
    throw new Error(`Error processing post ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Retrieves a blog post by its slug.
 * 
 * @param slug - The post slug
 * @returns {Promise<BlogPost>} The blog post
 * 
 * @example
 * ```typescript
 * const post = await getPostBySlug('my-first-post');
 * console.log(post.title);
 * ```
 */
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filename = `${slug}.md`;
  return getPostByFilename(filename);
}

/**
 * Retrieves all blog posts with full content.
 * 
 * @param includeUnpublished - Whether to include unpublished posts (default: false)
 * @returns {Promise<BlogPost[]>} Array of all blog posts
 * 
 * @example
 * ```typescript
 * const posts = await getAllPosts();
 * const allPosts = await getAllPosts(true); // Include unpublished
 * ```
 */
export async function getAllPosts(includeUnpublished: boolean = false): Promise<BlogPost[]> {
  const filenames = getPostFiles();
  const posts: BlogPost[] = [];
  
  for (const filename of filenames) {
    try {
      const post = await getPostByFilename(filename);
      
      if (includeUnpublished || post.published) {
        posts.push(post);
      }
    } catch (error) {
      console.error(`Error processing post ${filename}:`, error);
      // Continue processing other posts
    }
  }
  
  // Sort by date descending (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Retrieves blog post summaries (without full content) for listing pages.
 * 
 * @param includeUnpublished - Whether to include unpublished posts (default: false)
 * @returns {Promise<BlogPostSummary[]>} Array of blog post summaries
 * 
 * @example
 * ```typescript
 * const summaries = await getPostSummaries();
 * summaries.forEach(summary => console.log(summary.title));
 * ```
 */
export async function getPostSummaries(includeUnpublished: boolean = false): Promise<BlogPostSummary[]> {
  const filenames = getPostFiles();
  const summaries: BlogPostSummary[] = [];
  
  for (const filename of filenames) {
    try {
      const fullPath = path.join(POSTS_DIRECTORY, filename);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const frontmatter = parseFrontmatter(fileContent);
      
      const published = frontmatter.published !== false;
      if (!includeUnpublished && !published) {
        continue;
      }
      
      // Calculate reading time from content
      const wordCount = fileContent.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);
      
      const slug = filename.replace(/\.md$/, '');
      
      summaries.push({
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
        tags: frontmatter.tags || [],
        author: frontmatter.author || 'Anonymous',
        ...(frontmatter.image && { image: frontmatter.image }),
        published,
        readingTime,
        wordCount
      });
    } catch (error) {
      console.error(`Error processing post summary ${filename}:`, error);
      // Continue processing other posts
    }
  }
  
  // Sort by date descending (newest first)
  return summaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Retrieves posts filtered by tag.
 * 
 * @param tag - The tag to filter by
 * @param includeUnpublished - Whether to include unpublished posts (default: false)
 * @returns {Promise<BlogPostSummary[]>} Array of filtered blog post summaries
 * 
 * @example
 * ```typescript
 * const reactPosts = await getPostsByTag('react');
 * console.log(`Found ${reactPosts.length} React posts`);
 * ```
 */
export async function getPostsByTag(tag: string, includeUnpublished: boolean = false): Promise<BlogPostSummary[]> {
  const allSummaries = await getPostSummaries(includeUnpublished);
  return allSummaries.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Retrieves all unique tags from all posts.
 * 
 * @param includeUnpublished - Whether to include tags from unpublished posts (default: false)
 * @returns {Promise<string[]>} Array of unique tags
 * 
 * @example
 * ```typescript
 * const tags = await getAllTags();
 * console.log('Available tags:', tags);
 * ```
 */
export async function getAllTags(includeUnpublished: boolean = false): Promise<string[]> {
  const summaries = await getPostSummaries(includeUnpublished);
  const tagSet = new Set<string>();
  
  summaries.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Searches posts by title, description, or content.
 * 
 * @param query - The search query
 * @param includeUnpublished - Whether to include unpublished posts (default: false)
 * @returns {Promise<BlogPostSummary[]>} Array of matching blog post summaries
 * 
 * @example
 * ```typescript
 * const results = await searchPosts('react hooks');
 * console.log(`Found ${results.length} matching posts`);
 * ```
 */
export async function searchPosts(query: string, includeUnpublished: boolean = false): Promise<BlogPostSummary[]> {
  const summaries = await getPostSummaries(includeUnpublished);
  const searchTerm = query.toLowerCase();
  
  return summaries.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

/**
 * Gets the next and previous posts for navigation.
 * 
 * @param currentSlug - The current post slug
 * @param includeUnpublished - Whether to include unpublished posts (default: false)
 * @returns {Promise<{prev: BlogPostSummary | null, next: BlogPostSummary | null}>} Navigation posts
 * 
 * @example
 * ```typescript
 * const { prev, next } = await getAdjacentPosts('my-current-post');
 * if (prev) console.log('Previous:', prev.title);
 * if (next) console.log('Next:', next.title);
 * ```
 */
export async function getAdjacentPosts(currentSlug: string, includeUnpublished: boolean = false): Promise<{
  prev: BlogPostSummary | null;
  next: BlogPostSummary | null;
}> {
  const summaries = await getPostSummaries(includeUnpublished);
  const currentIndex = summaries.findIndex(post => post.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: currentIndex > 0 ? summaries[currentIndex - 1] || null : null,
    next: currentIndex < summaries.length - 1 ? summaries[currentIndex + 1] || null : null
  };
}