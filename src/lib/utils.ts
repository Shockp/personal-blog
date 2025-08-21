import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge for optimal Tailwind CSS class handling.
 *
 * This utility function merges class names intelligently, handling conditional classes
 * and resolving Tailwind CSS class conflicts by keeping the last conflicting class.
 *
 * @param inputs - Class values to be combined (strings, objects, arrays, etc.)
 * @returns {string} The merged class string
 *
 * @example
 * ```typescript
 * cn('px-2 py-1', 'px-4') // Returns: 'py-1 px-4'
 * cn('text-red-500', { 'text-blue-500': isActive }) // Conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a human-readable format.
 *
 * @param date - The date to format (string or Date object)
 * @param options - Intl.DateTimeFormat options for customization
 * @returns {string} The formatted date string
 *
 * @example
 * ```typescript
 * formatDate('2024-01-15') // Returns: 'January 15, 2024'
 * formatDate(new Date(), { dateStyle: 'short' }) // Returns: '1/15/24'
 * ```
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Calculates the estimated reading time for a given text.
 *
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 WPM)
 * @returns {number} Estimated reading time in minutes (rounded up)
 *
 * @example
 * ```typescript
 * getReadingTime('This is a sample text...') // Returns: 1
 * getReadingTime(longArticle, 250) // Custom reading speed
 * ```
 */
export function getReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Generates a URL-friendly slug from a given string.
 *
 * @param text - The text to convert to a slug
 * @returns {string} The generated slug
 *
 * @example
 * ```typescript
 * slugify('Hello World!') // Returns: 'hello-world'
 * slugify('My First Blog Post') // Returns: 'my-first-blog-post'
 * ```
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncates text to a specified length and adds ellipsis if needed.
 *
 * @param text - The text to truncate
 * @param maxLength - Maximum length of the truncated text
 * @param suffix - Suffix to add when text is truncated (default: '...')
 * @returns {string} The truncated text
 *
 * @example
 * ```typescript
 * truncateText('This is a long text', 10) // Returns: 'This is a...'
 * truncateText('Short', 10) // Returns: 'Short'
 * ```
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

/**
 * Debounces a function call, delaying execution until after a specified wait time.
 *
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns {Function} The debounced function
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   // Perform search
 * }, 300);
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
