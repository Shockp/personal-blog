/**
 * Async utility functions with type safety
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
}

/**
 * Delays execution for a specified number of milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a promise that resolves after a specified timeout
 */
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms)
    ),
  ]);
}

/**
 * Retries a promise-returning function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    shouldRetry = () => true,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }

      const delayMs = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      );

      await delay(delayMs);
    }
  }

  throw lastError!;
}

/**
 * Executes promises in batches with a specified concurrency limit
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize = 5
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}

/**
 * Executes promises sequentially (one after another)
 */
export async function sequential<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];

  for (const item of items) {
    const result = await processor(item);
    results.push(result);
  }

  return results;
}

/**
 * Wraps a promise to make it cancellable
 */
export function makeCancellable<T>(promise: Promise<T>): {
  promise: Promise<T>;
  cancel: () => void;
} {
  let isCancelled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then(value => {
        if (!isCancelled) resolve(value);
      })
      .catch(error => {
        if (!isCancelled) reject(error);
      });
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCancelled = true;
    },
  };
}

/**
 * Creates a memoized version of an async function
 */
export function memoizeAsync<
  T extends (...args: unknown[]) => Promise<unknown>,
>(fn: T, keyGenerator?: (...args: Parameters<T>) => string): T {
  const cache = new Map<string, Promise<Awaited<ReturnType<T>>>>();

  const defaultKeyGenerator = (...args: Parameters<T>) => JSON.stringify(args);
  const getKey = keyGenerator || defaultKeyGenerator;

  return ((...args: Parameters<T>) => {
    const key = getKey(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const promise = fn(...args) as Promise<Awaited<ReturnType<T>>>;
    cache.set(key, promise);

    // Remove from cache if promise rejects
    promise.catch(() => cache.delete(key));

    return promise;
  }) as T;
}

/**
 * Polls a function until a condition is met or timeout occurs
 */
export async function poll<T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: {
    interval?: number;
    timeout?: number;
    maxAttempts?: number;
  } = {}
): Promise<T> {
  const { interval = 1000, timeout = 30000, maxAttempts = Infinity } = options;

  const startTime = Date.now();
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Polling timeout exceeded');
    }

    try {
      const result = await fn();
      if (condition(result)) {
        return result;
      }
    } catch {
      // Continue polling on error
    }

    attempts++;
    await delay(interval);
  }

  throw new Error('Maximum polling attempts exceeded');
}

/**
 * Creates a queue that processes items one at a time
 */
export class AsyncQueue<T> {
  private queue: Array<() => Promise<T>> = [];
  private processing = false;

  async add<R>(fn: () => Promise<R>): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result as R);
          return result as T;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      try {
        await fn();
      } catch {
        // Error is already handled in the add method
      }
    }

    this.processing = false;
  }

  get size(): number {
    return this.queue.length;
  }

  get isProcessing(): boolean {
    return this.processing;
  }
}

/**
 * Wraps a function to ensure it's only called once
 */
export function once<T extends (...args: unknown[]) => unknown>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true;
      result = fn(...args) as ReturnType<T>;
    }
    return result;
  }) as T;
}

/**
 * Creates a promise that can be resolved or rejected externally
 */
export function createDeferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Converts a callback-based function to a promise-based one
 */
export function promisify<T extends unknown[], R>(
  fn: (...args: [...T, (error: Error | null, result?: R) => void]) => void
): (...args: T) => Promise<R> {
  return (...args: T) => {
    return new Promise<R>((resolve, reject) => {
      fn(...args, (error: Error | null, result?: R) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!);
        }
      });
    });
  };
}
