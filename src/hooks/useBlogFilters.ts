import { useState, useMemo, useEffect } from 'react';
import type { BlogPostSummary } from '@/types/blog';
import { BLOG_PAGINATION, BLOG_FILTERS } from '@/constants';

export interface BlogFiltersState {
  searchQuery: string;
  selectedTag: string;
  sortBy: 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  viewMode: 'grid' | 'list';
}

export interface BlogFiltersActions {
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string) => void;
  setSortBy: (sortBy: 'date' | 'title') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setCurrentPage: (page: number) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  handleSortChange: (
    sortBy: 'date' | 'title',
    sortOrder: 'asc' | 'desc'
  ) => void;
}

export interface BlogFiltersReturn
  extends BlogFiltersState,
    BlogFiltersActions {
  allTags: string[];
  filteredAndSortedPosts: BlogPostSummary[];
  paginatedPosts: BlogPostSummary[];
  totalPages: number;
}

export interface UseBlogFiltersOptions {
  posts: BlogPostSummary[];
  postsPerPage?: number;
  initialFilters?: Partial<BlogFiltersState>;
}

/**
 * Custom hook for managing blog post filtering, sorting, and pagination
 * Extracts complex state logic from BlogListingClient for better reusability
 */
export function useBlogFilters({
  posts,
  postsPerPage = BLOG_PAGINATION.DEFAULT_POSTS_PER_PAGE,
  initialFilters = {},
}: UseBlogFiltersOptions): BlogFiltersReturn {
  const [searchQuery, setSearchQuery] = useState(
    initialFilters.searchQuery || BLOG_FILTERS.DEFAULT_SEARCH_QUERY
  );
  const [selectedTag, setSelectedTag] = useState(
    initialFilters.selectedTag || BLOG_FILTERS.DEFAULT_SELECTED_TAG
  );
  const [sortBy, setSortBy] = useState<'date' | 'title'>(
    initialFilters.sortBy || BLOG_FILTERS.DEFAULT_SORT_BY
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    initialFilters.sortOrder || BLOG_FILTERS.DEFAULT_SORT_ORDER
  );
  const [currentPage, setCurrentPage] = useState(
    initialFilters.currentPage || BLOG_FILTERS.DEFAULT_CURRENT_PAGE
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    initialFilters.viewMode || BLOG_FILTERS.DEFAULT_VIEW_MODE
  );

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
          post.description.toLowerCase().includes(query) ||
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

  return {
    // State
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    currentPage,
    viewMode,
    // Actions
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setViewMode,
    handleSortChange,
    // Computed values
    allTags,
    filteredAndSortedPosts,
    paginatedPosts,
    totalPages,
  };
}
