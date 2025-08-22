'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState, useRef } from 'react';

/**
 * Simple theme toggle component
 * Provides a button to switch between light and dark themes
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    toggleTheme();
    // Remove focus after click with a smooth transition
    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current?.blur();
      }, 500);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className='p-2 rounded-md w-9 h-9' aria-hidden='true' />;
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className='p-2 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-muted focus:outline-none transition-all duration-500 cursor-pointer'
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Sun className='h-5 w-5' aria-hidden='true' />
      ) : (
        <Moon className='h-5 w-5' aria-hidden='true' />
      )}
    </button>
  );
}
