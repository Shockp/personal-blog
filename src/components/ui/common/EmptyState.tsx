'use client';

import { ReactNode } from 'react';
import { FileText, Search, Tag, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'search' | 'filter' | 'error';
}

const iconMap = {
  default: FileText,
  search: Search,
  filter: Tag,
  error: Calendar,
};

/**
 * Reusable empty state component for consistent messaging
 * Provides different variants for various empty state scenarios
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const IconComponent = iconMap[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className='mb-4'>
        {icon || (
          <IconComponent className='h-12 w-12 text-muted-foreground/50' />
        )}
      </div>

      <h3 className='text-lg font-semibold text-foreground mb-2'>{title}</h3>

      {description && (
        <p className='text-muted-foreground max-w-md mb-6'>{description}</p>
      )}

      {action && (
        <Button onClick={action.onClick} variant='outline'>
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Predefined empty state components for common scenarios
 */
export const EmptyStates = {
  NoPosts: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      variant='default'
      title='No blog posts found'
      description='There are no published blog posts to display at the moment.'
      {...props}
    />
  ),

  NoSearchResults: (searchQuery: string, props?: Partial<EmptyStateProps>) => (
    <EmptyState
      variant='search'
      title='No results found'
      description={`No blog posts match your search for "${searchQuery}". Try different keywords or browse all posts.`}
      {...props}
    />
  ),

  NoFilterResults: (filterType: string, props?: Partial<EmptyStateProps>) => (
    <EmptyState
      variant='filter'
      title='No posts with this filter'
      description={`No blog posts match the selected ${filterType}. Try a different filter or browse all posts.`}
      {...props}
    />
  ),

  LoadingError: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      variant='error'
      title='Unable to load posts'
      description='There was an error loading the blog posts. Please try again later.'
      {...props}
    />
  ),
};