import { ArrowLeft } from 'lucide-react';

/**
 * Loading Component for Blog Post Pages
 *
 * This component displays a skeleton loading state while the blog post
 * content is being fetched and rendered.
 */
export default function Loading() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Back to Blog Link Skeleton */}
        <div className='mb-8'>
          <div className='inline-flex items-center gap-2 text-sm'>
            <ArrowLeft className='w-4 h-4 text-muted-foreground' />
            <div className='h-4 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse' />
          </div>
        </div>

        {/* Post Header Skeleton */}
        <header className='mb-8'>
          {/* Title Skeleton */}
          <div className='space-y-3 mb-4'>
            <div className='h-12 bg-gray-200 dark:bg-muted rounded animate-pulse' />
            <div className='h-12 bg-gray-200 dark:bg-muted rounded animate-pulse w-3/4' />
          </div>

          {/* Description Skeleton */}
          <div className='space-y-2 mb-6'>
            <div className='h-6 bg-gray-200 dark:bg-muted rounded animate-pulse' />
            <div className='h-6 bg-gray-200 dark:bg-muted rounded animate-pulse w-5/6' />
          </div>

          {/* Metadata Skeleton */}
          <div className='flex flex-wrap items-center gap-6 mb-4'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
              <div className='h-4 w-24 bg-gray-200 dark:bg-muted rounded animate-pulse' />
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
              <div className='h-4 w-16 bg-gray-200 dark:bg-muted rounded animate-pulse' />
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
              <div className='h-4 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse' />
            </div>
          </div>

          {/* Tags Skeleton */}
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
            <div className='flex gap-2'>
              <div className='h-6 w-16 bg-gray-200 dark:bg-muted rounded-full animate-pulse' />
              <div className='h-6 w-20 bg-gray-200 dark:bg-muted rounded-full animate-pulse' />
              <div className='h-6 w-14 bg-gray-200 dark:bg-muted rounded-full animate-pulse' />
            </div>
          </div>
        </header>

        {/* Featured Image Skeleton */}
        <div className='mb-8'>
          <div className='w-full h-64 md:h-96 bg-gray-200 dark:bg-muted rounded-lg animate-pulse' />
        </div>

        {/* Content Layout */}
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Table of Contents Skeleton */}
          <aside className='lg:w-64 lg:flex-shrink-0'>
            <div className='sticky top-8'>
              <div className='h-6 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse mb-4' />
              <div className='space-y-2'>
                <div className='h-4 w-full bg-gray-200 dark:bg-muted rounded animate-pulse' />
                <div className='h-4 w-5/6 bg-gray-200 dark:bg-muted rounded animate-pulse ml-3' />
                <div className='h-4 w-4/5 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                <div className='h-4 w-3/4 bg-gray-200 dark:bg-muted rounded animate-pulse ml-3' />
                <div className='h-4 w-5/6 bg-gray-200 dark:bg-muted rounded animate-pulse' />
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className='flex-1 min-w-0'>
            <div className='space-y-6'>
              {/* Paragraph Skeletons */}
              <div className='space-y-3'>
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse w-4/5' />
              </div>

              <div className='space-y-3'>
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse w-5/6' />
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse w-3/4' />
              </div>

              {/* Code Block Skeleton */}
              <div className='h-32 bg-gray-200 dark:bg-muted rounded-lg animate-pulse' />

              <div className='space-y-3'>
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse w-4/5' />
                <div className='h-4 bg-gray-200 dark:bg-muted rounded animate-pulse' />
              </div>
            </div>

            {/* Social Sharing Skeleton */}
            <div className='mt-8 pt-8 border-t border-border'>
              <div className='flex items-center justify-between flex-wrap gap-4'>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                  <div className='h-4 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                </div>
                <div className='flex items-center gap-3'>
                  <div className='h-8 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                  <div className='h-8 w-24 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                  <div className='h-8 w-22 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                  <div className='h-8 w-16 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Navigation Skeleton */}
        <div className='border-t border-border pt-8 mt-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='p-4 border border-border rounded-lg'>
              <div className='h-4 w-24 bg-gray-200 dark:bg-muted rounded animate-pulse mb-2' />
              <div className='h-5 bg-gray-200 dark:bg-muted rounded animate-pulse' />
            </div>
            <div className='p-4 border border-border rounded-lg'>
              <div className='h-4 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse mb-2 ml-auto' />
              <div className='h-5 bg-gray-200 dark:bg-muted rounded animate-pulse' />
            </div>
          </div>
        </div>

        {/* Related Posts Skeleton */}
        <div className='border-t border-border pt-8 mt-8'>
          <div className='h-6 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse mb-6' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className='p-4 border border-border rounded-lg'>
                <div className='h-5 bg-gray-200 dark:bg-muted rounded animate-pulse mb-2' />
                <div className='space-y-2 mb-3'>
                  <div className='h-3 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                  <div className='h-3 bg-gray-200 dark:bg-muted rounded animate-pulse w-4/5' />
                </div>
                <div className='flex justify-between'>
                  <div className='h-3 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                  <div className='h-3 w-16 bg-gray-200 dark:bg-muted rounded animate-pulse' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
