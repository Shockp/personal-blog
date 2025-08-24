import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import {
  debounce,
  throttle,
  delay,
  timeout,
  retry,
  batchProcess,
  sequential,
  makeCancellable,
  memoizeAsync,
} from '../utils/async';

// Mock timers
jest.useFakeTimers();

describe('Async Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  describe('debounce', () => {
    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should cancel previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('first');
      debouncedFn('second');
      
      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });

    it('should execute immediately when immediate=true', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000, true);

      debouncedFn('test');
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should handle multiple arguments', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('arg1', 'arg2', 'arg3');
      jest.advanceTimersByTime(1000);
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });
  });

  describe('throttle', () => {
    it('should limit function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');
    });

    it('should allow calls after wait period', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn('first');
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      throttledFn('second');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should preserve function arguments', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn('arg1', 'arg2');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('delay', () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    it('should resolve after specified time', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(90); // Allow some tolerance
    });

    it('should resolve with undefined', async () => {
      const result = await delay(10);
      expect(result).toBeUndefined();
    });
  });

  describe('timeout', () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    it('should resolve if promise completes before timeout', async () => {
      const promise = Promise.resolve('success');
      const result = await timeout(promise, 1000);
      
      expect(result).toBe('success');
    });

    it('should reject if promise takes too long', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('late'), 200));
      
      await expect(timeout(promise, 100)).rejects.toThrow('Operation timed out');
    });

    it('should reject with original error if promise rejects first', async () => {
      const promise = Promise.reject(new Error('Original error'));
      
      await expect(timeout(promise, 1000)).rejects.toThrow('Original error');
    });
  });

  describe('retry', () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    it('should succeed on first attempt', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      
      const result = await retry(mockFn);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValue('success');
      
      const result = await retry(mockFn, { maxAttempts: 3, baseDelay: 10 });
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max attempts', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Persistent failure'));
      
      await expect(retry(mockFn, { maxAttempts: 2, baseDelay: 10 })).rejects.toThrow('Persistent failure');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should respect shouldRetry function', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Non-retryable'));
      const shouldRetry = jest.fn().mockReturnValue(false);
      
      await expect(retry(mockFn, { shouldRetry, baseDelay: 10 })).rejects.toThrow('Non-retryable');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(shouldRetry).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should use exponential backoff', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('First'))
        .mockRejectedValueOnce(new Error('Second'))
        .mockResolvedValue('success');
      
      const start = Date.now();
      await retry(mockFn, { maxAttempts: 3, baseDelay: 50, backoffFactor: 2 });
      const duration = Date.now() - start;
      
      // Should have delays of ~50ms and ~100ms
      expect(duration).toBeGreaterThan(140); // 50 + 100 - tolerance
    });
  });

  describe('batchProcess', () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    it('should process items in batches', async () => {
      const items = [1, 2, 3, 4, 5, 6, 7];
      const processor = jest.fn().mockImplementation(async (item: number) => item * 2);
      
      const results = await batchProcess(items, processor, 3);
      
      expect(results).toEqual([2, 4, 6, 8, 10, 12, 14]);
      expect(processor).toHaveBeenCalledTimes(7);
    });

    it('should handle empty array', async () => {
      const processor = jest.fn();
      
      const results = await batchProcess([], processor, 3);
      
      expect(results).toEqual([]);
      expect(processor).not.toHaveBeenCalled();
    });

    it('should handle batch size larger than array', async () => {
      const items = [1, 2];
      const processor = jest.fn().mockImplementation(async (item: number) => item * 2);
      
      const results = await batchProcess(items, processor, 5);
      
      expect(results).toEqual([2, 4]);
    });

    it('should handle processor errors', async () => {
      const items = [1, 2, 3];
      const processor = jest.fn()
        .mockResolvedValueOnce(2)
        .mockRejectedValueOnce(new Error('Processing error'))
        .mockResolvedValueOnce(6);
      
      await expect(batchProcess(items, processor, 2)).rejects.toThrow('Processing error');
    });
  });

  describe('sequential', () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    it('should process items sequentially', async () => {
      const items = [1, 2, 3];
      const callOrder: number[] = [];
      const processor = jest.fn().mockImplementation(async (item: number) => {
        await delay(10);
        callOrder.push(item);
        return item * 2;
      });
      
      const results = await sequential(items, processor);
      
      expect(results).toEqual([2, 4, 6]);
      expect(callOrder).toEqual([1, 2, 3]);
    });

    it('should handle empty array', async () => {
      const processor = jest.fn();
      
      const results = await sequential([], processor);
      
      expect(results).toEqual([]);
      expect(processor).not.toHaveBeenCalled();
    });

    it('should stop on first error', async () => {
      const items = [1, 2, 3];
      const processor = jest.fn()
        .mockResolvedValueOnce(2)
        .mockRejectedValueOnce(new Error('Sequential error'));
      
      await expect(sequential(items, processor)).rejects.toThrow('Sequential error');
      expect(processor).toHaveBeenCalledTimes(2);
    });
  });

  describe('makeCancellable', () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    it('should resolve normally when not cancelled', async () => {
      const promise = Promise.resolve('success');
      const { promise: cancellablePromise } = makeCancellable(promise);
      
      const result = await cancellablePromise;
      expect(result).toBe('success');
    });

    it('should not resolve when cancelled', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('success'), 100));
      const { promise: cancellablePromise, cancel } = makeCancellable(promise);
      
      cancel();
      
      // The promise should never resolve or reject
      let resolved = false;
      cancellablePromise.then(() => { resolved = true; }).catch(() => { resolved = true; });
      
      await delay(150);
      expect(resolved).toBe(false);
    });

    it('should not reject when cancelled', async () => {
      const promise = new Promise((_, reject) => setTimeout(() => reject(new Error('error')), 100));
      const { promise: cancellablePromise, cancel } = makeCancellable(promise);
      
      cancel();
      
      let resolved = false;
      cancellablePromise.then(() => { resolved = true; }).catch(() => { resolved = true; });
      
      await delay(150);
      expect(resolved).toBe(false);
    });
  });

  describe('memoizeAsync', () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    it('should cache successful results', async () => {
      const mockFn = jest.fn().mockImplementation(async (x: number) => x * 2);
      const memoized = memoizeAsync(mockFn);
      
      const result1 = await memoized(5);
      const result2 = await memoized(5);
      
      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should not cache failed results', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValueOnce(10);
      const memoized = memoizeAsync(mockFn);
      
      await expect(memoized(5)).rejects.toThrow('First failure');
      const result = await memoized(5);
      
      expect(result).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should use custom key generator', async () => {
      const mockFn = jest.fn().mockImplementation(async (obj: { id: number }) => obj.id * 2);
      const keyGen = (obj: { id: number }) => `key-${obj.id}`;
      const memoized = memoizeAsync(mockFn, keyGen);
      
      const result1 = await memoized({ id: 5 });
      const result2 = await memoized({ id: 5 });
      
      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle different arguments', async () => {
      const mockFn = jest.fn().mockImplementation(async (x: number) => x * 2);
      const memoized = memoizeAsync(mockFn);
      
      const result1 = await memoized(5);
      const result2 = await memoized(10);
      const result3 = await memoized(5);
      
      expect(result1).toBe(10);
      expect(result2).toBe(20);
      expect(result3).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});