'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Custom hook to use the theme context
 * @returns ThemeContextType object with theme state and functions
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component that manages theme state and persistence
 * Provides theme context to all child components
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Read initial theme prioritizing system preference, then localStorage, matching inline script logic
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    
    try {
      // First check if user has explicitly set a theme in localStorage
      const storedTheme = localStorage.getItem('theme');
      
      // If no stored theme, use system preference
      if (!storedTheme) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // Use stored theme if it's valid
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      
      // If stored theme is invalid, fall back to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      // If localStorage fails, check DOM state as fallback
      return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
    }
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag and sync with any potential theme changes
  useEffect(() => {
    setMounted(true);
    // Sync with the actual DOM state in case of any discrepancy
    const currentTheme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    if (currentTheme !== theme) {
      setThemeState(currentTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount to sync initial state

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const contextValue = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
