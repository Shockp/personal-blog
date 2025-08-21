'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  SortAsc,
  SortDesc,
  Grid,
  List,
} from 'lucide-react';
import PostCard from './PostCard';
import type { BlogPostSummary } from '@/types/blog';

// Empty state component
const EmptyState = ({
  searchQuery,
  selectedTag,
}: {
  searchQuery: string;
  selectedTag: string;
}) => (
  <div className='text-center py-16'>
    <div className='mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6'>
      <Search className='w-12 h-12 text-gray-400' />
    </div>
    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
      {searchQuery || selectedTag ? 'No posts found' : 'No blog posts yet'}
    </h3>
    <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
      {searchQuery
        ? `No posts match your search for "${searchQuery}"`
        : selectedTag
          ? `No posts found with the tag "${selectedTag}"`
          : 'Check back later for new content!'}
    </p>
  </div>
);

// Tag filter component
const TagFilter = ({
  tags,
  selectedTag,
  onTagSelect,
}: {
  tags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}) => (
  <div className='flex flex-wrap gap-2'>
    <button
      onClick={() => onTagSelect('')}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none cursor-pointer ${
        selectedTag === ''
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      All Posts
    </button>
    {tags.map(tag => (
      <button
        key={tag}
        onClick={() => onTagSelect(tag)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none cursor-pointer ${
          selectedTag === tag
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {tag}
      </button>
    ))}
  </div>
);

// Sort dropdown component
const SortDropdown = ({
  sortBy,
  sortOrder,
  onSortChange,
}: {
  sortBy: 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'date' | 'title', sortOrder: 'asc' | 'desc') => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    {
      value: 'date-desc',
      label: 'Newest First',
      sortBy: 'date' as const,
      sortOrder: 'desc' as const,
    },
    {
      value: 'date-asc',
      label: 'Oldest First',
      sortBy: 'date' as const,
      sortOrder: 'asc' as const,
    },
    {
      value: 'title-asc',
      label: 'Title A-Z',
      sortBy: 'title' as const,
      sortOrder: 'asc' as const,
    },
    {
      value: 'title-desc',
      label: 'Title Z-A',
      sortBy: 'title' as const,
      sortOrder: 'desc' as const,
    },
  ];

  const currentOption = sortOptions.find(
    option => option.sortBy === sortBy && option.sortOrder === sortOrder
  );

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-between px-4 py-2 w-44 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none cursor-pointer'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
      >
        <div className='flex items-center space-x-2'>
          {sortOrder === 'asc' ? (
            <SortDesc className='w-4 h-4' />
          ) : (
            <SortAsc className='w-4 h-4' />
          )}
          <span className='text-sm font-medium'>{currentOption?.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10'>
          <ul role='listbox' className='py-1'>
            {sortOptions.map(option => (
              <li key={option.value}>
                <button
                  onClick={() => {
                    onSortChange(option.sortBy, option.sortOrder);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg focus:outline-none cursor-pointer ${
                    currentOption?.value === option.value
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  role='option'
                  aria-selected={currentOption?.value === option.value}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className='flex justify-center items-center space-x-2 mt-12'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none cursor-pointer'
        aria-label='Previous page'
      >
        Previous
      </button>
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none cursor-pointer ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none cursor-pointer'
        aria-label='Next page'
      >
        Next
      </button>
    </div>
  );
};

// Main blog listing client component
export default function BlogListingClient({
  posts,
}: {
  posts: BlogPostSummary[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const postsPerPage = 9;

  // Get unique tags from all posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => post.published !== false);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags?.includes(selectedTag));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [posts, searchQuery, selectedTag, sortBy, sortOrder]);

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredAndSortedPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredAndSortedPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag, sortBy, sortOrder]);

  const handleSortChange = (
    newSortBy: 'date' | 'title',
    newSortOrder: 'asc' | 'desc'
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <>
      {/* Search and Filters */}
      <div className='mb-8 space-y-6'>
        {/* Search Bar */}
        <div className='relative max-w-md mx-auto'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search posts...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm sm:text-base min-h-[44px]'
            aria-label='Search blog posts'
          />
        </div>

        {/* Filters and Controls */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4'>
          {/* Tag Filter */}
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Filter by Tag:
            </h3>
            <TagFilter
              tags={allTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
          </div>

          {/* Sort and View Controls */}
          <div className='flex items-center space-x-4'>
            <SortDropdown
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
            <div className='flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors duration-200 focus:outline-none cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label='Grid view'
              >
                <Grid className='w-4 h-4' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors duration-200 focus:outline-none cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label='List view'
              >
                <List className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className='mb-6'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {filteredAndSortedPosts.length === 0
            ? 'No posts found'
            : `Showing ${paginatedPosts.length} of ${filteredAndSortedPosts.length} post${filteredAndSortedPosts.length === 1 ? '' : 's'}`}
        </p>
      </div>

      {/* Posts Grid/List */}
      {filteredAndSortedPosts.length === 0 ? (
        <EmptyState searchQuery={searchQuery} selectedTag={selectedTag} />
      ) : (
        <div
          className={`grid ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6'
              : 'grid-cols-1 gap-8'
          }`}
        >
          {paginatedPosts.map((post, index) => (
            <PostCard
              key={post.slug}
              post={post}
              priority={index < 3}
              className={viewMode === 'list' ? 'md:flex md:space-x-6' : ''}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
