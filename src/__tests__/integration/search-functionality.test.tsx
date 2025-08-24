import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogListingClient from '@/components/blog/BlogListingClient';
import { ThemeProvider } from '@/contexts/ThemeContext';
import type { BlogPostSummary } from '@/types/blog';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  X: () => <div data-testid="x-icon" />,
  Grid: () => <div data-testid="grid-icon" />,
  List: () => <div data-testid="list-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  User: () => <div data-testid="user-icon" />,
  Tag: () => <div data-testid="tag-icon" />,
  ChevronLeft: () => <div data-testid="chevron-left-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
}));

// Mock blog posts data
const mockBlogPosts: BlogPostSummary[] = [
  {
    slug: 'react-best-practices-2024',
    title: 'React Best Practices 2024',
    description: 'Learn the latest React best practices for building modern applications.',
    date: '2024-01-15',
    tags: ['react', 'javascript', 'frontend'],
    published: true,
    readingTime: 8,
    author: 'John Doe',
    excerpt: 'Discover the most effective React patterns and practices for 2024.',
    content: 'React has evolved significantly...',
    readTime: 8
  },
  {
    slug: 'typescript-tips-tricks',
    title: 'TypeScript Tips and Tricks',
    description: 'Advanced TypeScript techniques for better code quality.',
    date: '2024-01-10',
    tags: ['typescript', 'javascript'],
    published: true,
    readingTime: 6,
    author: 'Jane Smith',
    excerpt: 'Master advanced TypeScript features and patterns.',
    content: 'TypeScript provides powerful type system...',
    readTime: 6
  },
  {
    slug: 'nextjs-getting-started',
    title: 'Getting Started with Next.js',
    description: 'A comprehensive guide to Next.js for beginners.',
    date: '2024-01-05',
    tags: ['nextjs', 'react', 'javascript'],
    published: true,
    readingTime: 10,
    author: 'Bob Johnson',
    excerpt: 'Learn Next.js from scratch with practical examples.',
    content: 'Next.js is a powerful React framework...',
    readTime: 10
  },
  {
    slug: 'css-grid-layout-guide',
    title: 'CSS Grid Layout Guide',
    description: 'Master CSS Grid for modern web layouts.',
    date: '2024-01-01',
    tags: ['css', 'frontend', 'design'],
    published: true,
    readingTime: 7,
    author: 'Alice Wilson',
    excerpt: 'Complete guide to CSS Grid layout system.',
    content: 'CSS Grid is a powerful layout system...',
    readTime: 7
  }
];

// Helper function to render BlogListingClient with theme provider
const renderBlogListing = () => {
  return render(
    <ThemeProvider>
      <BlogListingClient posts={mockBlogPosts} />
    </ThemeProvider>
  );
};

describe('Search Functionality Integration Tests', () => {
  describe('Basic Rendering', () => {
    it('should render blog posts', async () => {
      renderBlogListing();
      
      // Check that blog posts are rendered
      expect(screen.getByText('React Best Practices 2024')).toBeInTheDocument();
      expect(screen.getByText('TypeScript Tips and Tricks')).toBeInTheDocument();
      expect(screen.getByText('Getting Started with Next.js')).toBeInTheDocument();
      expect(screen.getByText('CSS Grid Layout Guide')).toBeInTheDocument();
    });

    it('should render search input', async () => {
      renderBlogListing();
      
      const searchInput = screen.getByPlaceholderText('Search posts...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should show post count', async () => {
      renderBlogListing();
      
      expect(screen.getByText('4 posts')).toBeInTheDocument();
    });
  });

  describe('Tag Filtering', () => {
    it('should render tag buttons', async () => {
      renderBlogListing();
      
      // Check that tag buttons are rendered
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('javascript')).toBeInTheDocument();
      expect(screen.getByText('typescript')).toBeInTheDocument();
    });
  });

  describe('View Mode Toggle', () => {
    it('should render view mode toggle buttons', async () => {
      renderBlogListing();
      
      const gridButton = screen.getByLabelText('Grid view');
      const listButton = screen.getByLabelText('List view');
      
      expect(gridButton).toBeInTheDocument();
      expect(listButton).toBeInTheDocument();
    });
  });
});