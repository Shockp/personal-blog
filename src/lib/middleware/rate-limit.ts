import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate limiting configuration options
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Custom message for rate limit exceeded */
  message?: string;
  /** Whether to skip successful requests in counting */
  skipSuccessfulRequests?: boolean;
  /** Whether to skip failed requests in counting */
  skipFailedRequests?: boolean;
  /** Custom key generator function */
  keyGenerator?: (request: NextRequest) => string;
}

/**
 * Rate limit store interface
 */
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

/**
 * In-memory rate limit store
 * Note: In production, consider using Redis or another persistent store
 */
class MemoryRateLimitStore {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    );
  }

  /**
   * Get current count for a key
   */
  get(key: string): { count: number; resetTime: number } | null {
    const entry = this.store[key];
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.resetTime) {
      delete this.store[key];
      return null;
    }

    return entry;
  }

  /**
   * Increment count for a key
   */
  increment(
    key: string,
    windowMs: number
  ): { count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.get(key);

    if (existing) {
      existing.count++;
      this.store[key] = existing;
      return existing;
    } else {
      const newEntry = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.store[key] = newEntry;
      return newEntry;
    }
  }

  /**
   * Reset count for a key
   */
  reset(key: string): void {
    delete this.store[key];
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      const entry = this.store[key];
      if (entry && entry.resetTime <= now) {
        delete this.store[key];
      }
    });
  }

  /**
   * Destroy the store and cleanup interval
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store = {};
  }
}

// Global store instance
const globalStore = new MemoryRateLimitStore();

/**
 * Default key generator - uses IP address
 */
function defaultKeyGenerator(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  let ip = forwarded?.split(',')[0] || realIp || cfConnectingIp;

  // Fallback to a default if no IP is found
  if (!ip) {
    ip = 'unknown';
  }

  return ip.trim();
}

/**
 * Rate limiting middleware factory
 */
export function createRateLimit(config: RateLimitConfig) {
  const {
    maxRequests,
    windowMs,
    message = 'Too many requests, please try again later.',
    keyGenerator = defaultKeyGenerator,
  } = config;

  return async function rateLimitMiddleware(
    request: NextRequest,
    response?: NextResponse
  ): Promise<NextResponse | null> {
    try {
      const key = keyGenerator(request);
      const current = globalStore.increment(key, windowMs);

      // Add rate limit headers
      const headers = new Headers();
      headers.set('X-RateLimit-Limit', maxRequests.toString());
      headers.set(
        'X-RateLimit-Remaining',
        Math.max(0, maxRequests - current.count).toString()
      );
      headers.set(
        'X-RateLimit-Reset',
        Math.ceil(current.resetTime / 1000).toString()
      );

      // Check if rate limit exceeded
      if (current.count > maxRequests) {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message,
            retryAfter: Math.ceil((current.resetTime - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil(
                (current.resetTime - Date.now()) / 1000
              ).toString(),
              ...Object.fromEntries(headers.entries()),
            },
          }
        );
      }

      // If response is provided, add headers to it
      if (response) {
        headers.forEach((value, key) => {
          response.headers.set(key, value);
        });
      }

      return null; // Continue processing
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Rate limiting error:', error);
      // On error, allow the request to continue
      return null;
    }
  };
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  /** Strict rate limiting for authentication endpoints */
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message:
      'Too many authentication attempts, please try again in 15 minutes.',
  },

  /** Moderate rate limiting for API endpoints */
  api: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'API rate limit exceeded, please try again later.',
  },

  /** Lenient rate limiting for general requests */
  general: {
    maxRequests: 1000,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests, please slow down.',
  },

  /** Very strict rate limiting for sensitive operations */
  sensitive: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message:
      'Too many attempts for sensitive operation, please try again in 1 hour.',
  },

  /** Rate limiting for search endpoints */
  search: {
    maxRequests: 50,
    windowMs: 5 * 60 * 1000, // 5 minutes
    message: 'Search rate limit exceeded, please try again in a few minutes.',
  },

  /** Rate limiting for contact/feedback forms */
  contact: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many contact form submissions, please try again in 1 hour.',
  },
};

/**
 * Convenience functions for common rate limits
 */
export const authRateLimit = () => createRateLimit(rateLimitConfigs.auth);
export const apiRateLimit = () => createRateLimit(rateLimitConfigs.api);
export const generalRateLimit = () => createRateLimit(rateLimitConfigs.general);
export const sensitiveRateLimit = () =>
  createRateLimit(rateLimitConfigs.sensitive);
export const searchRateLimit = () => createRateLimit(rateLimitConfigs.search);
export const contactRateLimit = () => createRateLimit(rateLimitConfigs.contact);

/**
 * Rate limit middleware for Next.js API routes
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  const rateLimit = createRateLimit(config);

  return async function rateLimitedHandler(
    req: NextRequest
  ): Promise<NextResponse> {
    // Apply rate limiting
    const rateLimitResponse = await rateLimit(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Continue with original handler
    return handler(req);
  };
}

/**
 * Rate limit check function (doesn't increment counter)
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const key = (config.keyGenerator || defaultKeyGenerator)(request);
  const current = globalStore.get(key);

  if (!current) {
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: Date.now() + config.windowMs,
    };
  }

  return {
    allowed: current.count < config.maxRequests,
    remaining: Math.max(0, config.maxRequests - current.count),
    resetTime: current.resetTime,
  };
}

/**
 * Reset rate limit for a specific key
 */
export function resetRateLimit(
  request: NextRequest,
  keyGenerator?: (req: NextRequest) => string
): void {
  const key = (keyGenerator || defaultKeyGenerator)(request);
  globalStore.reset(key);
}

/**
 * Get current rate limit status for a key
 */
export function getRateLimitStatus(
  request: NextRequest,
  keyGenerator?: (req: NextRequest) => string
): {
  count: number;
  resetTime: number;
} | null {
  const key = (keyGenerator || defaultKeyGenerator)(request);
  return globalStore.get(key);
}
