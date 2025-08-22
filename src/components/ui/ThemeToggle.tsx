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
      className='group relative p-3 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
      style={{
        background: theme === 'light' 
          ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
          : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        color: '#ffffff'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Currently ${theme} mode - Click to switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className='relative flex items-center justify-center'>
        {theme === 'light' ? (
          <Sun className='h-5 w-5 animate-pulse' aria-hidden='true' />
        ) : (
          <Moon className='h-5 w-5 animate-pulse' aria-hidden='true' />
        )}
      </div>
    </button>
  );
}
