import Link from 'next/link';
import { ArrowLeft, FileX } from '@/components/ui/icons';

/**
 * Not Found Page for Blog Posts
 *
 * This page is displayed when a user tries to access a blog post that doesn't exist.
 * It provides a user-friendly error message and navigation options.
 */
export default function NotFound() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        {/* Error Icon */}
        <div className='mb-8'>
          <FileX className='w-24 h-24 mx-auto text-muted-foreground' />
        </div>

        {/* Error Message */}
        <h1 className='text-4xl font-bold text-foreground mb-4'>
          Post Not Found
        </h1>

        <p className='text-lg text-muted-foreground mb-8'>
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

          <div className='text-sm text-muted-foreground'>
            or{' '}
            <Link
              href='/'
              className='text-primary hover:text-primary/80 underline cursor-pointer'
            >
              go to homepage
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className='mt-12 p-4 bg-muted/50 rounded-lg'>
          <h3 className='text-sm font-medium text-foreground mb-2'>
            What you can do:
          </h3>
          <ul className='text-sm text-muted-foreground space-y-1'>
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
