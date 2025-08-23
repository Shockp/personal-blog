import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with type safety
 * Provides automatic serialization/deserialization and error handling
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch {
      // Silently return initial value if localStorage is not available
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for managing localStorage with SSR support
 * Returns null during SSR and actual value after hydration
 */
export function useLocalStorageSSR<T>(
  key: string,
  initialValue: T
): [T | null, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useLocalStorage(key, initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return [isLoaded ? storedValue : null, setStoredValue, isLoaded];
}