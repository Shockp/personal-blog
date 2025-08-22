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
        group relative rounded-xl transition-all duration-300 
        overflow-hidden hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 
        focus-within:ring-offset-2 h-full flex flex-col
        ${className}
      `}
      style={{
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--card-border)',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: 'var(--card-shadow)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--card-hover-shadow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--card-shadow)';
      }}
      role='article'
      aria-labelledby={`post-title-${slug}`}
    >
      <Link
        href={`/blog/${slug}`}
        className='block focus:outline-none h-full flex flex-col min-h-[44px]'
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
        <div className='p-4 sm:p-6 flex-1 flex flex-col'>
          {/* Meta information */}
          <div
            className='flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3'
            style={{ color: 'var(--card-text-secondary)' }}
          >
            {/* Reading time */}
            <div className='flex items-center gap-1 order-1 xs:order-2'>
              <Clock className='w-4 h-4' aria-hidden='true' />
              <span className='font-medium'>{readingTime} min read</span>
            </div>

            {/* Date */}
            <div className='flex items-center gap-1 order-2 xs:order-1'>
              <Calendar className='w-4 h-4' aria-hidden='true' />
              <time dateTime={date} className='font-medium'>
                {formattedDate}
              </time>
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
            className='text-lg sm:text-xl font-bold mb-3 transition-colors duration-500 line-clamp-2 leading-tight'
            style={{ color: 'var(--card-text)' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--card-text)';
            }}
          >
            {title}
          </h2>

          {/* Description */}
          <p
            className='text-sm sm:text-base line-clamp-3 leading-relaxed mb-4'
            style={{ color: 'var(--card-text-secondary)' }}
          >
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className='flex flex-wrap gap-1.5 sm:gap-2' role='list'>
              {tags.slice(0, 3).map(tag => (
                <button
                  key={tag}
                  onClick={e => handleTagClick(tag, e)}
                  className='inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-medium transition-colors duration-500 focus:outline-none cursor-pointer min-h-[24px]'
                  style={{
                    backgroundColor: 'var(--tag-bg)',
                    color: 'var(--tag-text)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor =
                      'var(--tag-hover-bg)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'var(--tag-bg)';
                  }}
                  role='listitem'
                  aria-label={`Filter posts by ${tag} tag`}
                  tabIndex={onTagClick ? 0 : -1}
                >
                  #{tag}
                </button>
              ))}
              {tags.length > 3 && (
                <span
                  className='inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-medium min-h-[24px]'
                  style={{
                    backgroundColor: 'var(--tag-secondary-bg)',
                    color: 'var(--tag-secondary-text)',
                  }}
                >
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Read more indicator */}
        <div
          className='
          absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 
          transition-opacity duration-500
        '
        >
          <span
            className='text-sm font-medium flex items-center gap-1'
            style={{ color: 'var(--primary)' }}
          >
            Read more
            <svg
              className='w-4 h-4 transition-transform duration-500'
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
      className='rounded-xl overflow-hidden animate-pulse'
      style={{
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--card-border)',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      {/* Content skeleton */}
      <div className='p-6'>
        {/* Meta skeleton */}
        <div className='flex gap-4 mb-3'>
          <div
            className='h-4 rounded w-24'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='h-4 rounded w-20'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='h-4 rounded w-16'
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>

        {/* Title skeleton */}
        <div
          className='h-6 rounded mb-3'
          style={{ backgroundColor: 'var(--muted)' }}
        />

        {/* Description skeleton */}
        <div className='space-y-2 mb-4'>
          <div
            className='h-4 rounded'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='h-4 rounded w-3/4'
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>

        {/* Tags skeleton */}
        <div className='flex gap-2'>
          <div
            className='h-6 rounded-full w-16'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='h-6 rounded-full w-20'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='h-6 rounded-full w-14'
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>
      </div>
    </div>
  );
}
