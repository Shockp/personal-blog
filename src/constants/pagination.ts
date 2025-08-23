/**
 * Pagination-related constants
 * Configuration values for pagination components
 */

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  SHOW_FIRST_LAST: true,
  SHOW_PREV_NEXT: true,
  MAX_VISIBLE_PAGES: 5,
  DEFAULT_SIZE: 'default' as const,
} as const;

// Pagination sizes
export const PAGINATION_SIZES = {
  SMALL: 'sm',
  DEFAULT: 'default',
  LARGE: 'lg',
} as const;

// Pagination labels
export const PAGINATION_LABELS = {
  FIRST: 'First',
  LAST: 'Last',
  PREVIOUS: 'Previous',
  NEXT: 'Next',
  GO_TO_FIRST: 'Go to first page',
  GO_TO_LAST: 'Go to last page',
  GO_TO_PREVIOUS: 'Go to previous page',
  GO_TO_NEXT: 'Go to next page',
  GO_TO_PAGE: 'Go to page',
  CURRENT_PAGE: 'page',
  PAGINATION_NAV: 'Pagination',
} as const;

// Results display
export const RESULTS_LABELS = {
  NO_POSTS_FOUND: 'No posts found',
  SHOWING: 'Showing',
  OF: 'of',
  POST: 'post',
  POSTS: 'posts',
  RESULTS: 'results',
  TO: 'to',
} as const;