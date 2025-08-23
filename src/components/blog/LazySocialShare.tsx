'use client';

import React, { Suspense, lazy } from 'react';
import { Share } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

/**
 * Props for the social sharing component
 */
interface SocialShareProps {
  /** The post title for social sharing */
  title: string;
  /** The post URL for social sharing */
  url: string;
}

/**
 * Loading skeleton for social sharing buttons
 */
function SocialShareSkeleton() {
  return (
    <div className='mt-8 pt-8 border-t border-border'>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div className='flex items-center gap-2'>
          <Share className='w-5 h-5 text-muted-foreground' />
          <span className='text-sm font-medium text-muted-foreground'>
            Share this article
          </span>
        </div>
        <div className='flex items-center gap-3'>
          {/* Skeleton buttons */}
          {[1, 2, 3, 4].map(i => (
            <div key={i} className='animate-pulse bg-muted h-8 w-16 rounded' />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Lazy-loaded social sharing component
 */
const SocialShare = lazy(() =>
  import('./SocialShare').then(module => ({
    default: module.SocialShare,
  }))
);

/**
 * Wrapper component for lazy-loaded social sharing
 */
export function LazySocialShare(props: SocialShareProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className='p-4 text-center border border-muted rounded-lg bg-muted/5'>
          <p className='text-sm text-muted-foreground'>
            Social sharing unavailable
          </p>
        </div>
      }
    >
      <Suspense fallback={<SocialShareSkeleton />}>
        <SocialShare {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default LazySocialShare;
