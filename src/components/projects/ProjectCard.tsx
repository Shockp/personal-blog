'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { Calendar } from '@/components/ui/icons';

/**
 * Technology color mapping to match the projects page styling
 */
const getTechnologyColors = (technology: string) => {
  const colorMap: Record<string, { backgroundColor: string; color: string; border: string }> = {
    'Next.js': {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      color: '#3b82f6',
      border: 'rgba(59, 130, 246, 0.3)'
    },
    'React': {
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      color: '#6366f1',
      border: 'rgba(99, 102, 241, 0.3)'
    },
    'TypeScript': {
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      color: '#a855f7',
      border: 'rgba(168, 85, 247, 0.3)'
    },
    'Tailwind CSS': {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      color: '#10b981',
      border: 'rgba(16, 185, 129, 0.3)'
    },
    'Node.js': {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      color: '#22c55e',
      border: 'rgba(34, 197, 94, 0.3)'
    },
    'Express': {
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      color: '#a855f7',
      border: 'rgba(168, 85, 247, 0.3)'
    },
    'Full-stack': {
      backgroundColor: 'rgba(234, 179, 8, 0.2)',
      color: '#eab308',
      border: 'rgba(234, 179, 8, 0.3)'
    },
    'Spring Boot': {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      color: '#22c55e',
      border: 'rgba(34, 197, 94, 0.3)'
    },
    'Redis': {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      border: 'rgba(239, 68, 68, 0.3)'
    },
    'API': {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      color: '#3b82f6',
      border: 'rgba(59, 130, 246, 0.3)'
    },
    'Java': {
      backgroundColor: 'rgba(245, 101, 101, 0.2)',
      color: '#f56565',
      border: 'rgba(245, 101, 101, 0.3)'
    },
    'Game': {
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      color: '#a855f7',
      border: 'rgba(168, 85, 247, 0.3)'
    },
    'Architecture': {
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      color: '#6366f1',
      border: 'rgba(99, 102, 241, 0.3)'
    },
    'REST API': {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      color: '#3b82f6',
      border: 'rgba(59, 130, 246, 0.3)'
    },
    'CLI': {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      color: '#22c55e',
      border: 'rgba(34, 197, 94, 0.3)'
    },
    'Python': {
      backgroundColor: 'rgba(234, 179, 8, 0.2)',
      color: '#eab308',
      border: 'rgba(234, 179, 8, 0.3)'
    }
  };

  // Return specific colors if found, otherwise return default colors
  return colorMap[technology] || {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    color: '#6b7280',
    border: 'rgba(107, 114, 128, 0.3)'
  };
};

/**
 * Props interface for the ProjectCard component
 * @interface ProjectCardProps
 */
export interface ProjectCardProps {
  /** Project data to display */
  project: Project;
  /** Additional CSS classes */
  className?: string;
  /** Click handler for technology selection */
  onTechnologyClick?: (technology: string) => void;
}

/**
 * ProjectCard component for displaying project summaries in a card format.
 * Features responsive design, technology tags, hover effects, and accessibility support.
 *
 * @component
 * @param {ProjectCardProps} props - Component props
 * @returns {JSX.Element} Rendered project card
 *
 * @example
 * ```tsx
 * <ProjectCard
 *   project={projectData}
 *   onTechnologyClick={(tech) => handleTechFilter(tech)}
 * />
 * ```
 */
export default function ProjectCard({
  project,
  className = '',
  onTechnologyClick,
}: ProjectCardProps) {
  const { id, title, description, date, technologies, githubUrl, category } = project;

  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle technology click
  const handleTechnologyClick = (technology: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onTechnologyClick?.(technology);
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
      aria-labelledby={`project-title-${id}`}
    >
      <Link
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className='block focus:outline-none h-full flex flex-col min-h-[44px]'
        aria-label={`View project: ${title} on GitHub`}
      >
        {/* Content */}
        <div className='p-4 sm:p-6 flex-1 flex flex-col'>
          {/* Meta information */}
          <div
            className='flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3'
            style={{ color: 'var(--card-text-secondary)' }}
          >
            {/* Date */}
            <div className='flex items-center gap-1'>
              <Calendar className='w-4 h-4' aria-hidden='true' />
              <time dateTime={date} className='font-medium'>
                {formattedDate}
              </time>
            </div>

            {/* Category */}
            {category && (
              <div className='flex items-center gap-1'>
                <span className='inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 hover:scale-105'
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}
                >
                  {category}
                </span>
              </div>
            )}


          </div>

          {/* Title */}
          <h2
            id={`project-title-${id}`}
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
            className='text-sm sm:text-base line-clamp-3 leading-relaxed mb-4 flex-1'
            style={{ color: 'var(--card-text-secondary)' }}
          >
            {description}
          </p>

          {/* Technologies */}
          {technologies && technologies.length > 0 && (
            <div className='flex flex-wrap gap-1.5 sm:gap-2' role='list'>
              {technologies.slice(0, 4).map(technology => {
                const colors = getTechnologyColors(technology);
                return (
                  <button
                    key={technology}
                    onClick={e => handleTechnologyClick(technology, e)}
                    className='inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-medium transition-all duration-300 focus:outline-none cursor-pointer min-h-[24px] border'
                    style={{
                      backgroundColor: colors.backgroundColor,
                      color: colors.color,
                      borderColor: colors.border,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = `0 2px 8px ${colors.backgroundColor}`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    role='listitem'
                    aria-label={`Filter projects by ${technology} technology`}
                    tabIndex={onTechnologyClick ? 0 : -1}
                  >
                    {technology}
                  </button>
                );
              })}
              {technologies.length > 4 && (
                <span
                  className='inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-medium min-h-[24px] border'
                  style={{
                    backgroundColor: 'rgba(107, 114, 128, 0.2)',
                    color: '#6b7280',
                    borderColor: 'rgba(107, 114, 128, 0.3)',
                  }}
                >
                  +{technologies.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>


      </Link>
    </article>
  );
}

/**
 * ProjectCard component with loading skeleton for better UX
 * @component
 */
export function ProjectCardSkeleton() {
  return (
    <div
      className='rounded-xl overflow-hidden animate-pulse h-full'
      style={{
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--card-border)',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      {/* Content skeleton */}
      <div className='p-4 sm:p-6 h-full flex flex-col'>
        {/* Meta skeleton */}
        <div className='flex gap-4 mb-3'>
          <div
            className='h-4 rounded w-24'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='h-4 rounded w-16'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='h-4 rounded w-4 ml-auto'
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>

        {/* Title skeleton */}
        <div
          className='h-6 rounded mb-3'
          style={{ backgroundColor: 'var(--muted)' }}
        />

        {/* Description skeleton */}
        <div className='space-y-2 mb-4 flex-1'>
          <div
            className='h-4 rounded'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='h-4 rounded w-3/4'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='h-4 rounded w-1/2'
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>

        {/* Technologies skeleton */}
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