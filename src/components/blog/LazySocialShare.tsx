'use client';

import { lazy, Suspense } from 'react';
import { Share } from '@/components/ui/icons';

// Dynamically import the SocialShare component
const SocialShare = lazy(() => import('./SocialShare'));

interface LazySocialShareProps {
  url: string;
  title: string;
  className?: string;
}

/**
 * Lazy-loaded Social Share Component
 *
 * Reduces initial bundle size by loading social sharing functionality on demand.
 * Shows a loading placeholder until the component is ready.
 */
const LazySocialShare: React.FC<LazySocialShareProps> = ({
  url,
  title,
  className,
}) => {
  return (
    <Suspense
      fallback={
        <div className={`flex items-center gap-2 ${className}`}>
          <Share className='w-5 h-5 text-muted-foreground' />
          <span className='text-sm text-muted-foreground'>
            Loading share options...
          </span>
        </div>
      }
    >
      <SocialShare url={url} title={title} />
    </Suspense>
  );
};

export default LazySocialShare;
