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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-md w-full space-y-8 text-center'>
        <div>
          <h1 className='text-9xl font-bold text-gray-300 dark:text-gray-700'>
            404
          </h1>
          <h2 className='mt-6 text-3xl font-bold text-gray-900 dark:text-white'>
            Page Not Found
          </h2>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        <div className='space-y-4'>
          <Link
            href='/'
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-colors'
          >
            Go back home
          </Link>
          <Link
            href='/blog'
            className='w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors'
          >
            Browse blog posts
          </Link>
        </div>
      </div>
    </div>
  );
}
