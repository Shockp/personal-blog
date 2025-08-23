'use client';

import React, { useState } from 'react';
import { Share, Linkedin, Facebook, Copy, Check } from 'lucide-react';

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
 * Social sharing component
 * Contains social media sharing functionality
 * This component is lazy-loaded to reduce initial bundle size
 */
export function SocialShare({ title, url }: SocialShareProps) {
  const [copySuccess, setCopySuccess] = useState<string>('');

  // Social sharing functions
  const shareOnX = () => {
    const text = `Check out this article: ${title}`;
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess('copied');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      setCopySuccess('error');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

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
          <button
            onClick={shareOnX}
            className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer'
            aria-label='Share on X'
          >
            <svg
              className='w-4 h-4'
              fill='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
            </svg>
            <span className='hidden sm:inline'>X</span>
          </button>
          <button
            onClick={shareOnLinkedIn}
            className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer'
            aria-label='Share on LinkedIn'
          >
            <Linkedin className='w-4 h-4' />
            <span className='hidden sm:inline'>LinkedIn</span>
          </button>
          <button
            onClick={shareOnFacebook}
            className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer'
            aria-label='Share on Facebook'
          >
            <Facebook className='w-4 h-4' />
            <span className='hidden sm:inline'>Facebook</span>
          </button>
          <button
            onClick={copyToClipboard}
            className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer'
            aria-label='Copy link'
          >
            {copySuccess === 'copied' ? (
              <Check className='w-4 h-4 text-green-600' />
            ) : (
              <Copy className='w-4 h-4' />
            )}
            <span className='hidden sm:inline'>
              {copySuccess === 'copied'
                ? 'Copied!'
                : copySuccess === 'error'
                  ? 'Error'
                  : 'Copy'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SocialShare;
