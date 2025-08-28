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
                <svg
                  className='w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 transform group-hover:scale-110 filter drop-shadow-lg group-hover:drop-shadow-xl'
                  style={{ color: 'var(--text-secondary)' }}
                  viewBox='0 0 1024 1024'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g
                    transform='translate(0,1024) scale(0.1,-0.1)'
                    fill='currentColor'
                    stroke='none'
                  >
                    <path
                      d='M3520 7665 c-26 -49 -161 -310 -300 -580 -139 -269 -269 -521 -290
-560 -20 -38 -71 -135 -112 -215 -42 -80 -152 -291 -245 -470 -94 -179 -273
-523 -398 -765 -126 -242 -297 -572 -382 -734 -84 -162 -153 -296 -153 -298 0
-2 164 -3 364 -3 l365 0 55 108 c30 59 115 222 188 362 l133 255 823 3 c452 1
822 5 822 10 0 4 -72 147 -159 317 l-159 310 -471 3 c-259 1 -471 5 -471 9 0
6 48 98 355 688 95 182 214 412 265 513 51 100 94 181 95 180 2 -2 155 -284
340 -628 186 -343 485 -895 665 -1225 180 -330 364 -669 410 -753 l82 -152
359 0 c243 0 359 3 359 10 0 6 -55 113 -121 238 -186 349 -361 675 -782 1457
-362 674 -717 1342 -717 1349 0 3 537 6 1193 6 1312 0 1270 1 1395 -62 247
-125 317 -440 140 -633 -58 -64 -112 -98 -201 -129 -60 -20 -82 -21 -739 -26
l-678 -5 54 -95 c30 -52 113 -203 184 -335 l130 -240 543 -6 c525 -5 546 -6
610 -27 126 -42 257 -149 304 -249 38 -79 51 -177 36 -260 -6 -37 -21 -87 -33
-111 -30 -64 -109 -145 -175 -179 -120 -64 -135 -66 -511 -71 -255 -3 -342 -7
-339 -15 3 -7 79 -147 169 -312 l165 -300 214 1 c167 0 234 4 304 18 215 44
401 138 552 279 353 330 425 890 167 1290 -59 92 -192 228 -267 274 l-57 36
73 76 c124 128 186 240 234 416 24 89 27 118 27 265 0 137 -4 180 -22 253 -46
183 -136 341 -277 483 -156 159 -349 255 -600 300 -93 17 -210 18 -1783 19
l-1683 0 -49 -90z'
                    />
                  </g>
                </svg>
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
