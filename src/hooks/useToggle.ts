import { useState, useCallback } from 'react';

/**
 * Custom hook for managing boolean toggle state
 * Provides a simple API for toggling between true/false values
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setToggle = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, setToggle];
}

/**
 * Hook for managing multiple toggle states
 * Useful when you have several independent boolean flags
 */
export function useMultipleToggle<T extends Record<string, boolean>>(
  initialState: T
): [
  T,
  (key: keyof T) => void,
  (key: keyof T, value: boolean) => void,
  () => void,
] {
  const [state, setState] = useState<T>(initialState);

  const toggle = useCallback((key: keyof T) => {
    setState(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const setToggle = useCallback((key: keyof T, value: boolean) => {
    setState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return [state, toggle, setToggle, resetAll];
}

/**
 * Hook for managing toggle state with localStorage persistence
 * Combines useToggle with useLocalStorage for persistent toggles
 */
export function usePersistedToggle(
  key: string,
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      // Silently return initial value if localStorage is not available
      return initialValue;
    }
  });

  const toggle = useCallback(() => {
    setValue(prev => {
      const newValue = !prev;
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch {
        // Silently fail if localStorage is not available
      }
      return newValue;
    });
  }, [key]);

  const setToggle = useCallback(
    (newValue: boolean) => {
      setValue(newValue);
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch {
        // Silently fail if localStorage is not available
      }
    },
    [key]
  );

  return [value, toggle, setToggle];
}