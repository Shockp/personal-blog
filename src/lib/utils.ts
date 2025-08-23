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
 * Enhanced version with immediate execution option and cancellation.
 *
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @param immediate - Whether to execute immediately on first call
 * @returns {Function & { cancel: () => void }} The debounced function with cancel method
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   // Perform search
 * }, 300);
 *
 * // Cancel pending execution
 * debouncedSearch.cancel();
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;
  let lastCallTime = 0;

  const debounced = (...args: Parameters<T>) => {
    const now = Date.now();
    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    if (callNow) {
      lastCallTime = now;
      func(...args);
    } else {
      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate || now - lastCallTime >= wait) {
          lastCallTime = now;
          func(...args);
        }
      }, wait);
    }
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

/**
 * Throttles a function call, ensuring it's called at most once per specified interval.
 *
 * @param func - The function to throttle
 * @param limit - The time limit in milliseconds
 * @returns {Function} The throttled function
 *
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   // Handle scroll
 * }, 100);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Creates a memoized version of a function that caches results.
 *
 * @param func - The function to memoize
 * @param getKey - Optional function to generate cache key
 * @returns {Function} The memoized function
 *
 * @example
 * ```typescript
 * const memoizedExpensive = memoize((n: number) => {
 *   // Expensive calculation
 *   return n * n;
 * });
 * ```
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T & { cache: Map<string, ReturnType<T>>; clear: () => void } {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T & { cache: Map<string, ReturnType<T>>; clear: () => void };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

/**
 * Safely parses JSON with error handling.
 *
 * @param json - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns {T} The parsed object or fallback value
 *
 * @example
 * ```typescript
 * const data = safeJsonParse('{"key": "value"}', {});
 * const invalid = safeJsonParse('invalid json', null);
 * ```
 */
export function safeJsonParse<T = unknown>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Clamps a number between min and max values.
 *
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns {number} The clamped value
 *
 * @example
 * ```typescript
 * clamp(15, 0, 10) // Returns: 10
 * clamp(-5, 0, 10) // Returns: 0
 * clamp(5, 0, 10)  // Returns: 5
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a random string of specified length.
 *
 * @param length - Length of the random string
 * @param charset - Character set to use (default: alphanumeric)
 * @returns {string} The random string
 *
 * @example
 * ```typescript
 * randomString(8) // Returns: 'aB3xY9mZ'
 * randomString(4, '0123456789') // Returns: '7392'
 * ```
 */
export function randomString(
  length: number,
  charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object).
 *
 * @param value - The value to check
 * @returns {boolean} True if the value is empty
 *
 * @example
 * ```typescript
 * isEmpty('') // Returns: true
 * isEmpty([]) // Returns: true
 * isEmpty({}) // Returns: true
 * isEmpty('hello') // Returns: false
 * ```
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Creates a promise that resolves after a specified delay.
 *
 * @param ms - Delay in milliseconds
 * @returns {Promise<void>} Promise that resolves after delay
 *
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
