'use client';

import { useEffect } from 'react';

export default function ThemeScript() {
  useEffect(() => {
    // Theme initialization logic - runs after hydration
    try {
      const savedTheme = localStorage.getItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const theme = savedTheme || systemTheme;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Ignore errors
    }
  }, []);

  // This component doesn't render anything visible
  // The theme logic runs in useEffect after hydration
  return null;
}