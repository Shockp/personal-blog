'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { Components } from 'react-markdown';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Lazy load the MarkdownRenderer component
const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'), {
  loading: () => (
    <div className='animate-pulse space-y-4'>
      <div className='h-4 bg-muted rounded w-3/4'></div>
      <div className='h-4 bg-muted rounded w-1/2'></div>
      <div className='h-4 bg-muted rounded w-5/6'></div>
      <div className='h-32 bg-muted rounded'></div>
      <div className='h-4 bg-muted rounded w-2/3'></div>
    </div>
  ),
  ssr: false,
});

export default function LazyMarkdownRenderer({
  content,
  components,
  sanitizedContent,
}: {
  content: string;
  components: Components;
  sanitizedContent: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className='p-6 text-center border border-destructive/20 rounded-lg bg-destructive/5'>
          <p className='text-destructive mb-2'>
            Failed to load markdown content
          </p>
          <p className='text-sm text-muted-foreground'>
            Please refresh the page to try again.
          </p>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className='animate-pulse space-y-4'>
            <div className='h-4 bg-muted rounded w-3/4'></div>
            <div className='h-4 bg-muted rounded w-1/2'></div>
            <div className='h-4 bg-muted rounded w-5/6'></div>
            <div className='h-32 bg-muted rounded'></div>
            <div className='h-4 bg-muted rounded w-2/3'></div>
          </div>
        }
      >
        <MarkdownRenderer
          content={content}
          components={components}
          sanitizedContent={sanitizedContent}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
