/**
 * String utility functions with type safety
 */

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a string to title case
 */
export function titleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Converts a string to camelCase
 */
export function camelCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

/**
 * Converts a string to kebab-case
 */
export function kebabCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to snake_case
 */
export function snakeCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Truncates a string to a specified length
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Truncates a string at word boundaries
 */
export function truncateWords(
  str: string,
  wordCount: number,
  suffix = '...'
): string {
  if (!str) return str;
  const words = str.split(/\s+/);
  if (words.length <= wordCount) return str;
  return words.slice(0, wordCount).join(' ') + suffix;
}

/**
 * Removes HTML tags from a string
 */
export function stripHtml(str: string): string {
  if (!str) return str;
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Escapes HTML characters in a string
 */
export function escapeHtml(str: string): string {
  if (!str) return str;
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, char => htmlEscapes[char]!);
}

/**
 * Unescapes HTML characters in a string
 */
export function unescapeHtml(str: string): string {
  if (!str) return str;
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  return str.replace(
    /&(?:amp|lt|gt|quot|#39);/g,
    entity => htmlUnescapes[entity]!
  );
}

/**
 * Generates a random string
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
 * Generates a URL-friendly slug from a string
 */
export function slugify(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Checks if a string is empty or contains only whitespace
 */
export function isBlank(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Checks if a string is not empty and contains non-whitespace characters
 */
export function isPresent(str: string): boolean {
  return !isBlank(str);
}

/**
 * Pads a string to a specified length
 */
export function padString(
  str: string,
  length: number,
  padChar = ' ',
  padLeft = false
): string {
  if (str.length >= length) return str;
  const padding = padChar.repeat(length - str.length);
  return padLeft ? padding + str : str + padding;
}

/**
 * Counts words in a string
 */
export function wordCount(str: string): number {
  if (!str) return 0;
  return str
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;
}

/**
 * Estimates reading time for a text
 */
export function estimateReadingTime(str: string, wordsPerMinute = 200): number {
  const words = wordCount(str);
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Extracts initials from a name
 */
export function getInitials(name: string, maxInitials = 2): string {
  if (!name) return '';
  return name
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxInitials)
    .join('');
}

/**
 * Highlights search terms in text
 */
export function highlightText(
  text: string,
  searchTerm: string,
  highlightClass = 'highlight'
): string {
  if (!text || !searchTerm) return text;
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}

/**
 * Escapes special regex characters in a string
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Pluralizes a word based on count
 */
export function pluralize(
  word: string,
  count: number,
  pluralForm?: string
): string {
  if (count === 1) return word;
  return pluralForm || word + 's';
}

/**
 * Formats a number with ordinal suffix (1st, 2nd, 3rd, etc.)
 */
export function ordinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]!);
}