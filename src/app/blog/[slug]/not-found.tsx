import Link from 'next/link';
import { ArrowLeft, FileX } from 'lucide-react';

/**
 * Not Found Page for Blog Posts
 *
 * This page is displayed when a user tries to access a blog post that doesn't exist.
 * It provides a user-friendly error message and navigation options.
 */
export default function NotFound() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        {/* Error Icon */}
        <div className='mb-8'>
          <FileX className='w-24 h-24 mx-auto text-gray-400 dark:text-gray-600' />
        </div>

        {/* Error Message */}
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          Post Not Found
        </h1>

        <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
          Sorry, the blog post you&apos;re looking for doesn&apos;t exist or has
          been moved.
        </p>

        {/* Navigation Options */}
        <div className='space-y-4'>
          <Link
            href='/blog'
            className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Blog
          </Link>

          <div className='text-sm text-gray-500 dark:text-gray-400'>
            or{' '}
            <Link
              href='/'
              className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer'
            >
              go to homepage
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className='mt-12 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
            What you can do:
          </h3>
          <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
            <li>• Check the URL for typos</li>
            <li>• Browse our latest blog posts</li>
            <li>• Use the search feature to find content</li>
            <li>• Contact us if you think this is an error</li>
          </ul>
        </div>
      </div>
    </div>
  );
}