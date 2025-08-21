'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

/**
 * Navigation component with responsive design
 * Provides main site navigation with mobile menu support
 */
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className='bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700'
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link
              href='/'
              className='text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'
              aria-label='Go to homepage'
            >
              Personal Blog
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <div className='flex items-baseline space-x-8'>
              <Link
                href='/'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                aria-label='Home page'
              >
                Home
              </Link>
              <Link
                href='/blog'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                aria-label='Blog posts'
              >
                Posts
              </Link>
              <Link
                href='/about'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                aria-label='About page'
              >
                About
              </Link>
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className='md:hidden flex items-center space-x-2'>
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200 cursor-pointer'
              aria-expanded={isMenuOpen}
              aria-label='Toggle mobile menu'
            >
              {isMenuOpen ? (
                <X className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className='md:hidden' role='menu'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700'>
            <Link
              href='/'
              className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
              onClick={closeMenu}
              role='menuitem'
            >
              Home
            </Link>
            <Link
              href='/blog'
              className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
              onClick={closeMenu}
              role='menuitem'
            >
              Posts
            </Link>
            <Link
              href='/about'
              className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
              onClick={closeMenu}
              role='menuitem'
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
