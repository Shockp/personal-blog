import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a JSDOM window for server-side DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window as unknown as Window & typeof globalThis);

/**
 * Configuration options for content sanitization
 */
export interface SanitizationOptions {
  /** Whether to allow HTML tags (default: false) */
  allowHtml?: boolean;
  /** Custom allowed HTML tags */
  allowedTags?: string[];
  /** Custom allowed HTML attributes */
  allowedAttributes?: string[];
  /** Whether to preserve line breaks (default: true) */
  preserveLineBreaks?: boolean;
  /** Maximum length for the content */
  maxLength?: number;
}

/**
 * Default sanitization configuration for user-generated content
 */
const DEFAULT_SANITIZATION_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Strict sanitization configuration (no HTML allowed)
 */
const STRICT_SANITIZATION_CONFIG = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param text - Raw text content to escape
 * @returns HTML-escaped text
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return text.replace(/[&<>"'`=/]/g, (match) => htmlEscapeMap[match] || match);
}

/**
 * Unescapes HTML entities back to their original characters
 * @param text - HTML-escaped text
 * @returns Unescaped text
 */
export function unescapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  const htmlUnescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
  };

  return text.replace(/&(?:amp|lt|gt|quot|#x27|#x2F|#x60|#x3D);/g, (match) => 
    htmlUnescapeMap[match] || match
  );
}

/**
 * Sanitizes user-generated content using DOMPurify
 * @param content - Raw user content
 * @param options - Sanitization options
 * @returns Sanitized content
 */
export function sanitizeUserContent(
  content: string,
  options: SanitizationOptions = {}
): string {
  if (typeof content !== 'string') {
    return '';
  }

  const {
    allowHtml = false,
    allowedTags = [],
    allowedAttributes = [],
    preserveLineBreaks = true,
    maxLength,
  } = options;

  let sanitizedContent = content;

  // Truncate content if maxLength is specified
  if (maxLength && sanitizedContent.length > maxLength) {
    sanitizedContent = sanitizedContent.substring(0, maxLength) + '...';
  }

  // Choose sanitization config based on options
  let config;
  if (allowHtml) {
    config = {
      ...DEFAULT_SANITIZATION_CONFIG,
      ALLOWED_TAGS: allowedTags.length > 0 ? allowedTags : DEFAULT_SANITIZATION_CONFIG.ALLOWED_TAGS,
      ALLOWED_ATTR: allowedAttributes,
    };
  } else {
    config = STRICT_SANITIZATION_CONFIG;
  }

  // Sanitize with DOMPurify
  const purifiedContent = purify.sanitize(sanitizedContent, config) as string;

  // Preserve line breaks if requested and no HTML is allowed
  let finalContent = purifiedContent;
  if (preserveLineBreaks && !allowHtml) {
    finalContent = finalContent.replace(/\n/g, '<br>');
  }

  return finalContent;
}

/**
 * Sanitizes and validates search query input
 * @param query - Raw search query
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized search query
 */
export function sanitizeSearchQuery(query: string, maxLength: number = 100): string {
  if (typeof query !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters and patterns
  let sanitized = query
    .replace(/[<>"'&\x00-\x1F\x7F]/g, '') // Remove HTML and control characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/drop|delete|union|select|insert|update|create|alter|exec|execute/gi, '') // Remove SQL keywords
    .replace(/alert|eval|prompt|confirm/gi, '') // Remove dangerous JavaScript functions
    .replace(/[\r\n\t]/g, ' ') // Replace line breaks and tabs with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes URL parameters to prevent injection attacks
 * @param param - URL parameter value
 * @param maxLength - Maximum allowed length (default: 200)
 * @returns Sanitized parameter
 */
export function sanitizeUrlParameter(param: string, maxLength: number = 200): string {
  if (typeof param !== 'string') {
    return '';
  }

  // URL decode first to handle encoded malicious content
  let sanitized;
  try {
    sanitized = decodeURIComponent(param);
  } catch {
    // If decoding fails, use original param
    sanitized = param;
  }

  // Remove potentially dangerous characters and patterns
  sanitized = sanitized
    .replace(/\.\./g, '') // Remove path traversal attempts
    .replace(/[<>"'&\x00-\x1F\x7F]/g, '') // Remove HTML and control characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes form input data
 * @param input - Raw form input
 * @param fieldType - Type of form field ('text', 'email', 'url', etc.)
 * @param maxLength - Maximum allowed length
 * @returns Sanitized input
 */
export function sanitizeFormInput(
  input: string,
  fieldType: 'text' | 'email' | 'url' | 'tel' | 'textarea' = 'text',
  maxLength: number = 500
): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();

  // Field-specific sanitization
  switch (fieldType) {
    case 'email':
      // Basic email sanitization - remove dangerous characters
      sanitized = sanitized.replace(/[<>"'&\x00-\x1F\x7F]/g, '');
      maxLength = Math.min(maxLength, 254); // RFC 5321 limit
      break;

    case 'url':
      // URL sanitization
      sanitized = sanitized
        .replace(/[<>"'&\x00-\x1F\x7F]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/vbscript:/gi, '');
      maxLength = Math.min(maxLength, 2048); // Common URL length limit
      break;

    case 'tel':
      // Phone number sanitization - keep only digits, spaces, hyphens, parentheses, plus
      sanitized = sanitized.replace(/[^0-9\s\-\(\)\+]/g, '');
      maxLength = Math.min(maxLength, 20);
      break;

    case 'textarea':
      // Textarea allows more content but still needs sanitization
      sanitized = escapeHtml(sanitized);
      maxLength = Math.min(maxLength, 5000);
      break;

    case 'text':
    default:
      // General text sanitization
      sanitized = escapeHtml(sanitized);
      break;
  }

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validates and sanitizes JSON input
 * @param jsonString - Raw JSON string
 * @param maxSize - Maximum size in bytes (default: 1MB)
 * @returns Sanitized JSON string or empty string if invalid
 */
export function sanitizeJsonInput(
  jsonString: string,
  maxSize: number = 1024 * 1024
): string {
  if (typeof jsonString !== 'string') {
    return '';
  }

  // Check size limit
  if (new Blob([jsonString]).size > maxSize) {
    return '';
  }

  // Remove dangerous patterns
  const sanitized = jsonString
    .replace(/__proto__/gi, '')
    .replace(/constructor/gi, '')
    .replace(/prototype/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/<script/gi, '')
    .replace(/"eval"/gi, '""')
    .replace(/eval\(/gi, '')
    .replace(/function\(/gi, '');

  try {
    // Validate that it's still valid JSON after sanitization
    JSON.parse(sanitized);
    return sanitized;
  } catch {
    return '';
  }
}

/**
 * Removes potentially dangerous file extensions and characters from filenames
 * @param filename - Original filename
 * @param maxLength - Maximum filename length (default: 255)
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string, maxLength: number = 255): string {
  if (typeof filename !== 'string') {
    return 'untitled';
  }

  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '');
  
  // Remove dangerous characters including spaces and special chars
  sanitized = sanitized.replace(/[<>:"/\\|?*\x00-\x1F\x7F\s@#%&+={}\[\]]/g, '');
  
  // Remove leading/trailing dots
  sanitized = sanitized.replace(/^[\.]+|[\.]+$/g, '');
  
  // Limit length
  if (sanitized.length > maxLength) {
    const ext = sanitized.lastIndexOf('.');
    if (ext > 0) {
      const name = sanitized.substring(0, ext);
      const extension = sanitized.substring(ext);
      const maxNameLength = maxLength - extension.length;
      sanitized = name.substring(0, maxNameLength) + extension;
    } else {
      sanitized = sanitized.substring(0, maxLength);
    }
  }
  
  // Ensure we have a valid filename
  return sanitized || 'untitled';
}

/**
 * Content Security Policy nonce generator
 * @returns Random nonce string for CSP
 */
export function generateCSPNonce(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto.getRandomValues
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Buffer.from(array).toString('base64');
}