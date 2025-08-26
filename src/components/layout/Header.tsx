'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from '@/components/ui/icons';
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

  return (
    <header
      className='shadow-sm border-b'
      style={{
        backgroundColor: 'var(--nav-background)',
        borderColor: 'var(--nav-border)',
      }}
      onKeyDown={handleKeyDown}
    >
      <nav
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        role='navigation'
        aria-label='Main navigation'
      >
        <div className='flex justify-between items-center h-14 sm:h-16 md:h-18'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link
              href='/'
              className='flex items-center min-h-[44px] py-2'
              aria-label='Go to homepage - AFB Tech Blog'
            >
              <div className='relative group'>
                {/* Main logo container */}
                <div className='relative w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 transform group-hover:scale-110'>
                  {/* Background geometric shape */}
                  <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl rotate-12 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl'></div>
                  
                  {/* Secondary geometric layer */}
                  <div className='absolute inset-1 bg-gradient-to-tl from-indigo-500 via-blue-500 to-purple-500 rounded-xl -rotate-6 group-hover:rotate-3 transition-all duration-300 opacity-80'></div>
                  
                  {/* Text container */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='relative text-white font-black text-sm sm:text-base tracking-tight transform group-hover:scale-105 transition-all duration-300 drop-shadow-sm'>
                      AFB
                    </span>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className='absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-6 lg:space-x-8'>
            <Link
              href='/'
              className='text-sm lg:text-base font-medium transition-all duration-200 px-3 py-2 rounded-md min-h-[44px] flex items-center'
              style={{
                color:
                  pathname === '/'
                    ? 'var(--nav-active-text)'
                    : 'var(--nav-text)',
                backgroundColor:
                  pathname === '/' ? 'var(--nav-active-bg)' : 'transparent',
              }}
              onMouseEnter={e => {
                if (pathname !== '/') {
                  e.currentTarget.style.backgroundColor = 'var(--nav-hover-bg)';
                  e.currentTarget.style.color = 'var(--nav-text-hover)';
                }
              }}
              onMouseLeave={e => {
                if (pathname !== '/') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--nav-text)';
                }
              }}
            >
              Home
            </Link>
            <Link
              href='/blog'
              className='text-sm lg:text-base font-medium transition-all duration-200 px-3 py-2 rounded-md min-h-[44px] flex items-center'
              style={{
                color:
                  pathname === '/blog'
                    ? 'var(--nav-active-text)'
                    : 'var(--nav-text)',
                backgroundColor:
                  pathname === '/blog' ? 'var(--nav-active-bg)' : 'transparent',
              }}
              onMouseEnter={e => {
                if (pathname !== '/blog') {
                  e.currentTarget.style.backgroundColor = 'var(--nav-hover-bg)';
                  e.currentTarget.style.color = 'var(--nav-text-hover)';
                }
              }}
              onMouseLeave={e => {
                if (pathname !== '/blog') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--nav-text)';
                }
              }}
            >
              Blog
            </Link>
            <Link
              href='/about'
              className='text-sm lg:text-base font-medium transition-all duration-200 px-3 py-2 rounded-md min-h-[44px] flex items-center'
              style={{
                color:
                  pathname === '/about'
                    ? 'var(--nav-active-text)'
                    : 'var(--nav-text)',
                backgroundColor:
                  pathname === '/about'
                    ? 'var(--nav-active-bg)'
                    : 'transparent',
              }}
              onMouseEnter={e => {
                if (pathname !== '/about') {
                  e.currentTarget.style.backgroundColor = 'var(--nav-hover-bg)';
                  e.currentTarget.style.color = 'var(--nav-text-hover)';
                }
              }}
              onMouseLeave={e => {
                if (pathname !== '/about') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--nav-text)';
                }
              }}
            >
              About
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile menu button and theme toggle */}
          <div className='md:hidden flex items-center space-x-1'>
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className='inline-flex items-center justify-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset min-h-[44px] min-w-[44px]'
              style={{
                color: 'var(--nav-text)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--nav-hover-bg)';
                e.currentTarget.style.color = 'var(--nav-text-hover)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--nav-text)';
              }}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
              aria-controls='mobile-menu'
            >
              <span className='sr-only'>
                {isMenuOpen ? 'Close' : 'Open'} main menu
              </span>
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
          <div
            className='px-4 pt-3 pb-4 space-y-2 border-t shadow-lg'
            style={{
              backgroundColor: 'var(--nav-background)',
              borderColor: 'var(--nav-border)',
            }}
          >
            <Link
              href='/'
              className='block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 min-h-[44px] flex items-center'
              style={{
                color: isActiveLink('/')
                  ? 'var(--nav-active-text)'
                  : 'var(--nav-text)',
                backgroundColor: isActiveLink('/')
                  ? 'var(--nav-active-bg)'
                  : 'transparent',
              }}
              onMouseEnter={e => {
                if (!isActiveLink('/')) {
                  e.currentTarget.style.backgroundColor = 'var(--nav-hover-bg)';
                  e.currentTarget.style.color = 'var(--nav-text-hover)';
                }
              }}
              onMouseLeave={e => {
                if (!isActiveLink('/')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--nav-text)';
                }
              }}
              onClick={closeMenu}
              role='menuitem'
              aria-current={isActiveLink('/') ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href='/blog'
              className='block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 min-h-[44px] flex items-center'
              style={{
                color: isActiveLink('/blog')
                  ? 'var(--nav-active-text)'
                  : 'var(--nav-text)',
                backgroundColor: isActiveLink('/blog')
                  ? 'var(--nav-active-bg)'
                  : 'transparent',
              }}
              onMouseEnter={e => {
                if (!isActiveLink('/blog')) {
                  e.currentTarget.style.backgroundColor = 'var(--nav-hover-bg)';
                  e.currentTarget.style.color = 'var(--nav-text-hover)';
                }
              }}
              onMouseLeave={e => {
                if (!isActiveLink('/blog')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--nav-text)';
                }
              }}
              onClick={closeMenu}
              role='menuitem'
              aria-current={isActiveLink('/blog') ? 'page' : undefined}
            >
              Blog
            </Link>
            <Link
              href='/about'
              className='block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 min-h-[44px] flex items-center'
              style={{
                color: isActiveLink('/about')
                  ? 'var(--nav-active-text)'
                  : 'var(--nav-text)',
                backgroundColor: isActiveLink('/about')
                  ? 'var(--nav-active-bg)'
                  : 'transparent',
              }}
              onMouseEnter={e => {
                if (!isActiveLink('/about')) {
                  e.currentTarget.style.backgroundColor = 'var(--nav-hover-bg)';
                  e.currentTarget.style.color = 'var(--nav-text-hover)';
                }
              }}
              onMouseLeave={e => {
                if (!isActiveLink('/about')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--nav-text)';
                }
              }}
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
