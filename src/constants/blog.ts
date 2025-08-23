/**
 * Blog-related constants
 * Configuration values for blog functionality
 */

// Pagination settings
export const BLOG_PAGINATION = {
  DEFAULT_POSTS_PER_PAGE: 9,
  MAX_POSTS_PER_PAGE: 50,
} as const;

// Default filter states
export const BLOG_FILTERS = {
  DEFAULT_SORT_BY: 'date' as const,
  DEFAULT_SORT_ORDER: 'desc' as const,
  DEFAULT_VIEW_MODE: 'grid' as const,
  DEFAULT_SEARCH_QUERY: '',
  DEFAULT_SELECTED_TAG: '',
  DEFAULT_CURRENT_PAGE: 1,
} as const;

// Search configuration
export const BLOG_SEARCH = {
  MIN_SEARCH_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  PLACEHOLDER_TEXT: 'Search posts...',
} as const;

// View modes
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
} as const;

// Sort options
export const SORT_OPTIONS = {
  DATE: 'date',
  TITLE: 'title',
} as const;

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// Filter labels
export const FILTER_LABELS = {
  ALL_TAGS: 'All Tags',
  FILTER_BY_TAG: 'Filter by Tag:',
  SORT_BY: 'Sort by',
  SELECT_TAG: 'Select a tag',
} as const;

// Results display labels
export const RESULTS_LABELS = {
  SHOWING_RESULTS: (start: number, end: number, total: number) => 
    `Showing ${start}-${end} of ${total} posts`,
  TOTAL_POSTS: (count: number) => 
    `${count} ${count === 1 ? 'post' : 'posts'}`,
  SEARCH_RESULTS: (count: number, query: string) => 
    `${count} ${count === 1 ? 'result' : 'results'} for "${query}"`,
  TAG_RESULTS: (count: number, tag: string) => 
    `${count} ${count === 1 ? 'post' : 'posts'} tagged with "${tag}"`,
  NO_RESULTS: 'No results found',
} as const;