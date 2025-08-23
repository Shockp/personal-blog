'use client';

import React from 'react';
import { Button } from '@/components/ui/common';
import { FILTER_LABELS } from '@/constants';
import type { BlogPostSummary } from '@/types/blog';

interface TagButtonsProps {
  /** All available tags */
  tags: string[];
  /** Currently selected tag */
  selectedTag: string;
  /** Tag selection handler */
  onTagSelect: (tag: string) => void;
  /** All posts for calculating counts */
  posts: BlogPostSummary[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * TagButtons component that displays individual tag filter buttons with post counts
 * Replaces the dropdown approach with direct clickable buttons
 */
export default function TagButtons({
  tags,
  selectedTag,
  onTagSelect,
  posts,
  className = '',
}: TagButtonsProps) {
  // Calculate tag counts
  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Count posts for each tag
    tags.forEach(tag => {
      counts[tag] = posts.filter(post => 
        post.published !== false && post.tags?.includes(tag)
      ).length;
    });
    
    return counts;
  }, [tags, posts]);

  // Calculate total posts count
  const totalPostsCount = React.useMemo(() => {
    return posts.filter(post => post.published !== false).length;
  }, [posts]);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* All Posts button */}
      <Button
        variant={selectedTag === '' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTagSelect('')}
        className="transition-all duration-200 hover:scale-105 rounded-full px-4"
      >
        {FILTER_LABELS.ALL_TAGS}
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full border ${
          selectedTag === ''
            ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30'
            : 'bg-primary/10 text-primary border-primary/20'
        }`}>
          {totalPostsCount}
        </span>
      </Button>

      {/* Individual tag buttons */}
      {tags.map(tag => {
        const count = tagCounts[tag] || 0;
        const isSelected = selectedTag === tag;
        
        return (
          <Button
            key={tag}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTagSelect(tag)}
            className="transition-all duration-200 hover:scale-105 rounded-full px-4"
          >
            {tag}
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full border ${
              isSelected
                ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30'
                : 'bg-primary/10 text-primary border-primary/20'
            }`}>
              {count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}