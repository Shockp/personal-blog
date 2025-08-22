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
      className='bg-background shadow-sm border-b border-border'
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link
              href='/'
              className='text-2xl font-bold transition-colors duration-200'
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = 'var(--text-accent)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = 'var(--text-primary)')
              }
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
                className='px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = 'var(--text-accent)')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.color = 'var(--text-secondary)')
                }
                aria-label='Home page'
              >
                Home
              </Link>
              <Link
                href='/blog'
                className='px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = 'var(--text-accent)')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.color = 'var(--text-secondary)')
                }
                aria-label='Blog posts'
              >
                Posts
              </Link>
              <Link
                href='/about'
                className='px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = 'var(--text-accent)')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.color = 'var(--text-secondary)')
                }
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
              className='inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200 cursor-pointer'
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = 'var(--text-accent)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = 'var(--text-secondary)')
              }
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
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border'>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = 'var(--text-accent)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = 'var(--text-secondary)')
              }
              onClick={closeMenu}
              role='menuitem'
            >
              Home
            </Link>
            <Link
              href='/blog'
              className='block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = 'var(--text-accent)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = 'var(--text-secondary)')
              }
              onClick={closeMenu}
              role='menuitem'
            >
              Posts
            </Link>
            <Link
              href='/about'
              className='block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = 'var(--text-accent)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = 'var(--text-secondary)')
              }
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
