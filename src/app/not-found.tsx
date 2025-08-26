/**
 * Not Found Page Component
 *
 * This component is automatically rendered by Next.js when a route is not found.
 * It provides a user-friendly 404 error page with navigation options.
 *
 * @returns {JSX.Element} The 404 not found page
 */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='max-w-md w-full space-y-8 text-center'>
        <div>
          <h1
            className='text-9xl font-bold'
            style={{ color: 'var(--text-muted)' }}
          >
            404
          </h1>
          <h2
            className='mt-6 text-3xl font-bold'
            style={{ color: 'var(--text-primary)' }}
          >
            Page Not Found
          </h2>
          <p
            className='mt-2 text-sm'
            style={{ color: 'var(--text-secondary)' }}
          >
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        <div className='space-y-4'>
          <Link
            href='/'
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200'
          >
            Go back home
          </Link>
          <Link
            href='/blog'
            className='w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium bg-secondary hover:bg-hover-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200'
            style={{ 
              color: 'var(--text-secondary)',
              borderColor: 'var(--border)'
            }}
          >
            Browse blog posts
          </Link>
        </div>
      </div>
    </div>
  );
}
