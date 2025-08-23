/**
 * UI-related constants
 * Component defaults and styling configurations
 */

// Button variants and sizes
export const BUTTON_VARIANTS = {
  DEFAULT: 'default',
  DESTRUCTIVE: 'destructive',
  OUTLINE: 'outline',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  LINK: 'link',
} as const;

export const BUTTON_SIZES = {
  DEFAULT: 'default',
  SM: 'sm',
  LG: 'lg',
  ICON: 'icon',
} as const;

// Dropdown configuration
export const DROPDOWN_DEFAULTS = {
  PLACEHOLDER: 'Select option',
  ALIGN: 'left' as const,
  DISABLED: false,
} as const;

export const DROPDOWN_ALIGNMENT = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

// Empty state variants
export const EMPTY_STATE_VARIANTS = {
  DEFAULT: 'default',
  SEARCH: 'search',
  FILTER: 'filter',
  ERROR: 'error',
} as const;

// Empty state messages
export const EMPTY_STATE_MESSAGES = {
  NO_RESULTS_FOUND: 'No results found',
  NO_POSTS_WITH_TAG: 'No posts with this tag',
  NO_BLOG_POSTS_FOUND: 'No blog posts found',
  NO_SEARCH_RESULTS: (query: string) =>
    `No blog posts match your search for "${query}". Try different keywords or browse all posts.`,
  NO_TAG_RESULTS: (tag: string) =>
    `No blog posts are tagged with "${tag}". Try a different tag or browse all posts.`,
  NO_POSTS_AVAILABLE:
    'There are no published blog posts to display at the moment.',
} as const;

// Search input configuration
export const SEARCH_INPUT_DEFAULTS = {
  SHOW_CLEAR_BUTTON: true,
  CLEAR_LABEL: 'Clear search',
} as const;

// View mode icons and labels
export const VIEW_MODE_CONFIG = {
  GRID: {
    label: 'Grid view',
    icon: 'Grid',
  },
  LIST: {
    label: 'List view',
    icon: 'List',
  },
} as const;

// Animation and transition durations (in ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  DEFAULT: 200,
  SLOW: 300,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 50,
  MODAL: 100,
  TOOLTIP: 200,
  TOAST: 300,
} as const;