'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPostSummary } from '@/types/blog';
import { Clock, Calendar, User } from 'lucide-react';

/**
 * Props interface for the PostCard component
 * @interface PostCardProps
 */
export interface PostCardProps {
  /** Blog post data to display */
  post: BlogPostSummary;
  /** Whether to prioritize image loading (for above-the-fold content) */
  priority?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler for tag selection */
  onTagClick?: (tag: string) => void;
}

/**
 * PostCard component for displaying blog post summaries in a card format.
 * Features responsive design, image optimization, reading time display,
 * tag display, hover effects, and accessibility support.
 *
 * @component
 * @param {PostCardProps} props - Component props
 * @returns {JSX.Element} Rendered post card
 *
 * @example
 * ```tsx
 * <PostCard
 *   post={blogPost}
 *   priority={true}
 *   onTagClick={(tag) => handleTagFilter(tag)}
 * />
 * ```
 */
export default function PostCard({
  post,
  priority = false,
  className = '',
  onTagClick,
}: PostCardProps) {
  const { slug, title, description, date, tags, author, image, readingTime } =
    post;

  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle tag click
  const handleTagClick = (tag: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onTagClick?.(tag);
  };

  return (
    <article
      className={`
        group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm 
        hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 
        border border-gray-200 dark:border-gray-700 overflow-hidden
        hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 
        focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800
        h-full flex flex-col
        ${className}
      `}
      role='article'
      aria-labelledby={`post-title-${slug}`}
    >
      <Link
        href={`/blog/${slug}`}
        className='block focus:outline-none h-full flex flex-col'
        aria-label={`Read full article: ${title}`}
      >
        {/* Featured Image */}
        {image && (
          <div className='relative aspect-video w-full overflow-hidden'>
            <Image
              src={image}
              alt={`Featured image for ${title}`}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              priority={priority}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            {/* Gradient overlay for better text readability */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
          </div>
        )}

        {/* Content */}
        <div className='p-6 flex-1 flex flex-col'>
          {/* Meta information */}
          <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3'>
            {/* Date */}
            <div className='flex items-center gap-1'>
              <Calendar className='w-4 h-4' aria-hidden='true' />
              <time dateTime={date} className='font-medium'>
                {formattedDate}
              </time>
            </div>

            {/* Reading time */}
            <div className='flex items-center gap-1'>
              <Clock className='w-4 h-4' aria-hidden='true' />
              <span className='font-medium'>{readingTime} min read</span>
            </div>

            {/* Author */}
            {author && (
              <div className='flex items-center gap-1'>
                <User className='w-4 h-4' aria-hidden='true' />
                <span className='font-medium'>{author}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h2
            id={`post-title-${slug}`}
            className='
              text-xl font-bold text-gray-900 dark:text-white mb-3 
              group-hover:text-blue-600 dark:group-hover:text-blue-400 
              transition-colors duration-200 line-clamp-2
            '
          >
            {title}
          </h2>

          {/* Description */}
          <p
            className='
            text-gray-600 dark:text-gray-300 line-clamp-3 
            leading-relaxed mb-4
          '
          >
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className='flex flex-wrap gap-2' role='list'>
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={e => handleTagClick(tag, e)}
                  className='
                    inline-flex items-center px-2.5 py-1 rounded-full text-xs 
                    font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 
                    dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 
                    transition-colors duration-200 focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                    dark:focus:ring-offset-gray-800
                  '
                  role='listitem'
                  aria-label={`Filter posts by ${tag} tag`}
                  tabIndex={onTagClick ? 0 : -1}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Read more indicator */}
        <div
          className='
          absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 
          transition-opacity duration-200
        '
        >
          <span
            className='
            text-sm font-medium text-blue-600 dark:text-blue-400 
            flex items-center gap-1
          '
          >
            Read more
            <svg
              className='w-4 h-4 transition-transform group-hover:translate-x-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}

/**
 * PostCard component with loading skeleton for better UX
 * @component
 */
export function PostCardSkeleton() {
  return (
    <div
      className='
      bg-white dark:bg-gray-800 rounded-xl shadow-sm border 
      border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse
    '
    >
      {/* Image skeleton */}
      <div className='aspect-video w-full bg-gray-200 dark:bg-gray-700' />

      {/* Content skeleton */}
      <div className='p-6'>
        {/* Meta skeleton */}
        <div className='flex gap-4 mb-3'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-24' />
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-20' />
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-16' />
        </div>

        {/* Title skeleton */}
        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3' />

        {/* Description skeleton */}
        <div className='space-y-2 mb-4'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded' />
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
        </div>

        {/* Tags skeleton */}
        <div className='flex gap-2'>
          <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16' />
          <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20' />
          <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14' />
        </div>
      </div>
    </div>
  );
}
