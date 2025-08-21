/**
 * Core blog post interface with all metadata and content
 */
export interface BlogPost {
  /** Unique identifier for the post (URL-friendly) */
  slug: string;
  /** Post title */
  title: string;
  /** Brief description or excerpt */
  description: string;
  /** Publication date in YYYY-MM-DD format */
  date: string;
  /** Array of tags associated with the post */
  tags: string[];
  /** Author name */
  author: string;
  /** Optional featured image URL */
  image?: string;
  /** Whether the post is published (visible to public) */
  published: boolean;
  /** Full HTML content of the post */
  content: string;
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Total word count */
  wordCount: number;
}

/**
 * Blog post summary interface for listing pages (without full content)
 */
export interface BlogPostSummary {
  /** Unique identifier for the post (URL-friendly) */
  slug: string;
  /** Post title */
  title: string;
  /** Brief description or excerpt */
  description: string;
  /** Publication date in YYYY-MM-DD format */
  date: string;
  /** Array of tags associated with the post */
  tags: string[];
  /** Author name */
  author: string;
  /** Optional featured image URL */
  image?: string;
  /** Whether the post is published (visible to public) */
  published: boolean;
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Total word count */
  wordCount: number;
}

/**
 * Markdown frontmatter interface for blog posts
 */
export interface BlogPostFrontmatter {
  /** Post title (required) */
  title: string;
  /** Brief description or excerpt (required) */
  description: string;
  /** Publication date in YYYY-MM-DD format (required) */
  date: string;
  /** Array of tags associated with the post */
  tags?: string[];
  /** Author name */
  author?: string;
  /** Optional featured image URL */
  image?: string;
  /** Whether the post is published (default: true) */
  published?: boolean;
  /** Any additional custom fields */
  [key: string]: any;
}

/**
 * Table of contents entry interface
 */
export interface TocEntry {
  /** Heading level (1-6) */
  level: number;
  /** Heading text content */
  text: string;
  /** URL-friendly slug for the heading */
  slug: string;
}

/**
 * Blog navigation interface for prev/next post links
 */
export interface BlogNavigation {
  /** Previous post (older) */
  prev: BlogPostSummary | null;
  /** Next post (newer) */
  next: BlogPostSummary | null;
}

/**
 * Search result interface
 */
export interface SearchResult {
  /** Matching blog posts */
  posts: BlogPostSummary[];
  /** Search query that was used */
  query: string;
  /** Total number of results */
  total: number;
}

/**
 * Tag with post count interface
 */
export interface TagWithCount {
  /** Tag name */
  name: string;
  /** Number of posts with this tag */
  count: number;
  /** URL-friendly slug for the tag */
  slug: string;
}

/**
 * Blog statistics interface
 */
export interface BlogStats {
  /** Total number of published posts */
  totalPosts: number;
  /** Total number of draft posts */
  totalDrafts: number;
  /** All unique tags */
  tags: string[];
  /** Most recent post date */
  lastUpdated: string;
  /** Total word count across all posts */
  totalWords: number;
}

/**
 * Pagination interface for blog post listings
 */
export interface Pagination {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Previous page number (null if no previous page) */
  previousPage: number | null;
  /** Next page number (null if no next page) */
  nextPage: number | null;
}

/**
 * Paginated blog posts result interface
 */
export interface PaginatedBlogPosts {
  /** Blog posts for the current page */
  posts: BlogPostSummary[];
  /** Pagination metadata */
  pagination: Pagination;
}

/**
 * Blog filter options interface
 */
export interface BlogFilterOptions {
  /** Filter by specific tag */
  tag?: string;
  /** Filter by author */
  author?: string;
  /** Filter by year */
  year?: number;
  /** Search query */
  search?: string;
  /** Include unpublished posts (admin only) */
  includeUnpublished?: boolean;
  /** Sort order */
  sortBy?: 'date' | 'title' | 'readingTime';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Blog post validation error interface
 */
export interface BlogPostValidationError {
  /** Field that failed validation */
  field: string;
  /** Error message */
  message: string;
  /** Error code for programmatic handling */
  code: string;
}

/**
 * Blog post processing result interface
 */
export interface BlogPostProcessingResult {
  /** Whether processing was successful */
  success: boolean;
  /** Processed blog post (if successful) */
  post?: BlogPost;
  /** Validation errors (if any) */
  errors?: BlogPostValidationError[];
  /** Processing warnings (non-fatal) */
  warnings?: string[];
}

/**
 * RSS feed item interface
 */
export interface RSSFeedItem {
  /** Post title */
  title: string;
  /** Post description */
  description: string;
  /** Full post URL */
  link: string;
  /** Publication date */
  pubDate: string;
  /** Unique identifier */
  guid: string;
  /** Author information */
  author: string;
  /** Post categories/tags */
  categories: string[];
}

/**
 * Site metadata interface for SEO and RSS
 */
export interface SiteMetadata {
  /** Site title */
  title: string;
  /** Site description */
  description: string;
  /** Site URL */
  url: string;
  /** Site author/owner */
  author: string;
  /** Site language code */
  language: string;
  /** Copyright notice */
  copyright: string;
  /** Social media links */
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  /** Primary color scheme */
  primaryColor: string;
  /** Secondary color scheme */
  secondaryColor: string;
  /** Font family for headings */
  headingFont: string;
  /** Font family for body text */
  bodyFont: string;
  /** Code syntax highlighting theme */
  codeTheme: 'light' | 'dark' | 'auto';
  /** Default theme mode */
  defaultMode: 'light' | 'dark' | 'system';
}

/**
 * Component props interfaces
 */

/**
 * Props for BlogPostCard component
 */
export interface BlogPostCardProps {
  /** Blog post summary data */
  post: BlogPostSummary;
  /** Whether to show the featured image */
  showImage?: boolean;
  /** Whether to show tags */
  showTags?: boolean;
  /** Whether to show reading time */
  showReadingTime?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for BlogPostList component
 */
export interface BlogPostListProps {
  /** Array of blog post summaries */
  posts: BlogPostSummary[];
  /** Whether to show pagination */
  showPagination?: boolean;
  /** Pagination data (if showPagination is true) */
  pagination?: Pagination;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for TagList component
 */
export interface TagListProps {
  /** Array of tags */
  tags: string[];
  /** Currently selected tag */
  selectedTag?: string;
  /** Click handler for tag selection */
  onTagClick?: (tag: string) => void;
  /** Whether to show post counts */
  showCounts?: boolean;
  /** Tag counts (if showCounts is true) */
  tagCounts?: Record<string, number>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for SearchBox component
 */
export interface SearchBoxProps {
  /** Current search query */
  query: string;
  /** Search query change handler */
  onQueryChange: (query: string) => void;
  /** Search submit handler */
  onSearch: (query: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for Pagination component
 */
export interface PaginationProps {
  /** Pagination data */
  pagination: Pagination;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Base URL for pagination links */
  baseUrl?: string;
  /** Additional CSS classes */
  className?: string;
}