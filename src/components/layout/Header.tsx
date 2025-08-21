'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

/**
 * Header component with responsive navigation menu
 * Provides main site navigation with mobile menu support and accessibility features
 * Complies with WCAG 2.1 AA standards
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const getLinkClasses = (href: string) => {
    const baseClasses =
      'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none';
    const activeClasses =
      'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    const inactiveClasses =
      'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800';

    return `${baseClasses} ${isActiveLink(href) ? activeClasses : inactiveClasses}`;
  };

  const getMobileLinkClasses = (href: string) => {
    const baseClasses =
      'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none';
    const activeClasses =
      'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    const inactiveClasses =
      'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800';

    return `${baseClasses} ${isActiveLink(href) ? activeClasses : inactiveClasses}`;
  };

  return (
    <header
      className='bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700'
      onKeyDown={handleKeyDown}
    >
      <nav
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        role='navigation'
        aria-label='Main navigation'
      >
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link
              href='/'
              className='text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none'
              aria-label='Go to homepage - Personal Blog'
            >
              Personal Blog
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <div className='flex items-baseline space-x-4' role='menubar'>
              <Link
                href='/'
                className={getLinkClasses('/')}
                aria-label='Home page'
                role='menuitem'
                aria-current={isActiveLink('/') ? 'page' : undefined}
              >
                Home
              </Link>
              <Link
                href='/blog'
                className={getLinkClasses('/blog')}
                aria-label='Blog posts'
                role='menuitem'
                aria-current={isActiveLink('/blog') ? 'page' : undefined}
              >
                Posts
              </Link>
              <Link
                href='/about'
                className={getLinkClasses('/about')}
                aria-label='About page'
                role='menuitem'
                aria-current={isActiveLink('/about') ? 'page' : undefined}
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
              aria-label={isMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-controls='mobile-menu'
            >
              {isMenuOpen ? (
                <X className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div
          className='md:hidden'
          id='mobile-menu'
          role='menu'
          aria-labelledby='mobile-menu-button'
        >
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700'>
            <Link
              href='/'
              className={getMobileLinkClasses('/')}
              onClick={closeMenu}
              role='menuitem'
              aria-current={isActiveLink('/') ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href='/blog'
              className={getMobileLinkClasses('/blog')}
              onClick={closeMenu}
              role='menuitem'
              aria-current={isActiveLink('/blog') ? 'page' : undefined}
            >
              Posts
            </Link>
            <Link
              href='/about'
              className={getMobileLinkClasses('/about')}
              onClick={closeMenu}
              role='menuitem'
              aria-current={isActiveLink('/about') ? 'page' : undefined}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
