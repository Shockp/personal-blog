'use client';

import { Grid, List } from 'lucide-react';
import PostCard from './PostCard';
import TagButtons from './TagButtons';
import type { BlogPostSummary } from '@/types/blog';
import { useBlogFilters } from '@/hooks';
import {
  SearchInput,
  Button,
  Dropdown,
  Pagination,
  EmptyState,
} from '@/components/ui/common';

import {
  SORT_DROPDOWN_OPTIONS,
  FILTER_LABELS,
  BLOG_SEARCH,
  EMPTY_STATE_MESSAGES,
  VIEW_MODE_CONFIG,
  createSortValue,
  parseSortValue,
} from '@/constants';
import { RESULTS_LABELS as BLOG_RESULTS_LABELS } from '@/constants/blog';

// Sort dropdown component using Dropdown
const SortDropdown = ({
  sortBy,
  sortOrder,
  onSortChange,
}: {
  sortBy: 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'date' | 'title', sortOrder: 'asc' | 'desc') => void;
}) => {
  const sortOptions = SORT_DROPDOWN_OPTIONS;

  const currentValue = createSortValue(sortBy, sortOrder);

  const handleSortChange = (value: string) => {
    const { sortBy: newSortBy, sortOrder: newSortOrder } =
      parseSortValue(value);
    onSortChange(newSortBy as 'date' | 'title', newSortOrder as 'asc' | 'desc');
  };

  return (
    <Dropdown
      options={sortOptions}
      value={currentValue}
      onSelect={handleSortChange}
      placeholder='Sort by'
      className='w-40'
    />
  );
};

// Main blog listing client component
export default function BlogListingClient({
  posts,
}: {
  posts: BlogPostSummary[];
}) {
  const {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode,
    allTags,
    filteredAndSortedPosts,
    paginatedPosts,
    totalPages,
  } = useBlogFilters({ posts });

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
        <div className='max-w-md mx-auto'>
          <SearchInput
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={BLOG_SEARCH.PLACEHOLDER_TEXT}
            showClearButton
            onClear={() => setSearchQuery('')}
            className='flex-1'
          />
        </div>

        {/* Filters and Controls */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4'>
          {/* Tag Filter */}
          <div className='flex-1'>
            <h3 className='text-sm font-medium mb-2 text-muted-foreground'>
              {FILTER_LABELS.FILTER_BY_TAG}
            </h3>
            <TagButtons
              tags={allTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
              posts={posts}
            />
          </div>

          {/* Sort and View Controls */}
          <div className='flex items-center space-x-4'>
            <SortDropdown
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
            <div className='flex rounded-lg border border-border overflow-hidden'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size='icon'
                onClick={() => setViewMode('grid')}
                className='rounded-none border-r border-border'
                aria-label={VIEW_MODE_CONFIG.GRID.label}
              >
                <Grid className='w-4 h-4' />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size='icon'
                onClick={() => setViewMode('list')}
                className='rounded-none'
                aria-label={VIEW_MODE_CONFIG.LIST.label}
              >
                <List className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className='mb-6'>
        <p className='text-sm text-muted-foreground'>
          {filteredAndSortedPosts.length === 0
            ? BLOG_RESULTS_LABELS.NO_RESULTS
            : BLOG_RESULTS_LABELS.TOTAL_POSTS(filteredAndSortedPosts.length)}
        </p>
      </div>

      {/* Posts Grid/List */}
      {filteredAndSortedPosts.length === 0 ? (
        <EmptyState
          variant={searchQuery ? 'search' : selectedTag ? 'filter' : 'default'}
          title={
            searchQuery
              ? EMPTY_STATE_MESSAGES.NO_RESULTS_FOUND
              : selectedTag
                ? EMPTY_STATE_MESSAGES.NO_POSTS_WITH_TAG
                : EMPTY_STATE_MESSAGES.NO_BLOG_POSTS_FOUND
          }
          description={
            searchQuery
              ? EMPTY_STATE_MESSAGES.NO_SEARCH_RESULTS(searchQuery)
              : selectedTag
                ? EMPTY_STATE_MESSAGES.NO_TAG_RESULTS(selectedTag)
                : EMPTY_STATE_MESSAGES.NO_POSTS_AVAILABLE
          }
        />
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
        showFirstLast
        showPrevNext
      />
    </>
  );
}
