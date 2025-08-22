'use client';

import Link from 'next/link';

/**
 * Footer component with social media links and copyright information
 * Provides site footer with navigation links, social media connections, and accessibility features
 * Complies with WCAG 2.1 AA standards
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-background border-t border-border' role='contentinfo'>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* About Section */}
          <div>
            <h3
              className='text-sm font-semibold tracking-wider uppercase'
              style={{ color: 'var(--text-primary)' }}
            >
              About
            </h3>
            <p
              className='mt-4 text-base'
              style={{ color: 'var(--text-secondary)' }}
            >
              A personal blog sharing thoughts, experiences, and insights on
              technology, life, and everything in between.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className='text-sm font-semibold tracking-wider uppercase'
              style={{ color: 'var(--text-primary)' }}
            >
              Quick Links
            </h3>
            <nav aria-label='Footer navigation'>
              <ul className='mt-4 space-y-4'>
                <li>
                  <Link
                    href='/'
                    className='text-base transition-colors duration-200 focus:outline-none'
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = 'var(--text-accent)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = 'var(--text-secondary)')
                    }
                    aria-label='Go to home page'
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href='/blog'
                    className='text-base transition-colors duration-200 focus:outline-none'
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = 'var(--text-accent)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = 'var(--text-secondary)')
                    }
                    aria-label='Go to blog posts'
                  >
                    Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href='/about'
                    className='text-base transition-colors duration-200 focus:outline-none'
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = 'var(--text-accent)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = 'var(--text-secondary)')
                    }
                    aria-label='Go to about page'
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href='/contact'
                    className='text-base transition-colors duration-200 focus:outline-none'
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = 'var(--text-accent)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = 'var(--text-secondary)')
                    }
                    aria-label='Go to contact page'
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h3
              className='text-sm font-semibold tracking-wider uppercase'
              style={{ color: 'var(--text-primary)' }}
            >
              Connect
            </h3>
            <div className='mt-4 flex space-x-6'>
              <a
                href='https://x.com'
                className='transition-colors duration-200 focus:outline-none'
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = 'var(--text-accent)')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.color = 'var(--text-secondary)')
                }
                aria-label='Follow on X (opens in new tab)'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                </svg>
              </a>
              <a
                href='https://github.com'
                className='transition-colors duration-200 focus:outline-none'
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = 'var(--text-accent)')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.color = 'var(--text-secondary)')
                }
                aria-label='Follow on GitHub (opens in new tab)'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
              <a
                href='https://linkedin.com'
                className='transition-colors duration-200 focus:outline-none'
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = 'var(--text-accent)')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.color = 'var(--text-secondary)')
                }
                aria-label='Connect on LinkedIn (opens in new tab)'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-8 border-t border-gray-200 dark:border-gray-700 pt-8'>
          <p
            className='text-base text-center'
            style={{ color: 'var(--text-secondary)' }}
          >
            &copy; {currentYear} Adrian. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
