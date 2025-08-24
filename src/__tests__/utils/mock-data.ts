import { BlogPost } from '@/types/blog';

// Mock blog posts for integration testing
export const mockBlogPosts: BlogPost[] = [
  {
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js 15',
    excerpt: 'Learn how to build modern web applications with Next.js 15 and its latest features.',
    content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements that make building React applications even better.

## Key Features

- **Turbopack**: Faster development builds
- **App Router**: Enhanced routing capabilities
- **Server Components**: Better performance

## Getting Started

To create a new Next.js project:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will set up a new project with all the latest features.`,
    date: '2024-01-15',
    readingTime: 8,
    tags: ['nextjs', 'react', 'web-development'],
    author: 'Adrian',
  },
  {
    slug: 'react-best-practices-2024',
    title: 'React Best Practices for 2024',
    excerpt: 'Discover the latest React best practices and patterns for building scalable applications.',
    content: `# React Best Practices for 2024

As React continues to evolve, so do the best practices for building maintainable applications.

## Component Design

- Keep components small and focused
- Use composition over inheritance
- Implement proper error boundaries

## State Management

- Use built-in hooks when possible
- Consider external state management for complex apps
- Implement proper data flow patterns

## Performance

- Use React.memo for expensive components
- Implement proper key props for lists
- Optimize bundle size with code splitting`,
    date: '2024-01-10',
    readingTime: 12,
    tags: ['react', 'best-practices', 'performance'],
    author: 'Adrian',
  },
  {
    slug: 'typescript-tips-and-tricks',
    title: 'TypeScript Tips and Tricks',
    excerpt: 'Advanced TypeScript techniques to improve your development workflow.',
    content: `# TypeScript Tips and Tricks

TypeScript offers powerful features that can significantly improve your development experience.

## Advanced Types

- Utility types for common patterns
- Conditional types for flexible APIs
- Template literal types for string manipulation

## Best Practices

- Use strict mode for better type safety
- Leverage type inference when possible
- Create reusable type definitions

## Tooling

- Configure ESLint with TypeScript rules
- Use proper tsconfig.json settings
- Integrate with your IDE for better DX`,
    date: '2024-01-05',
    readingTime: 10,
    tags: ['typescript', 'tips', 'development'],
    author: 'Adrian',
  },
  {
    slug: 'web-performance-optimization',
    title: 'Web Performance Optimization Guide',
    excerpt: 'Comprehensive guide to optimizing web application performance.',
    content: `# Web Performance Optimization Guide

Performance is crucial for user experience and SEO rankings.

## Core Web Vitals

- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay
- **CLS**: Cumulative Layout Shift

## Optimization Techniques

- Image optimization and lazy loading
- Code splitting and bundle optimization
- Caching strategies
- CDN implementation

## Monitoring

- Use Lighthouse for audits
- Implement real user monitoring
- Set up performance budgets`,
    date: '2024-01-01',
    readingTime: 15,
    tags: ['performance', 'optimization', 'web-vitals'],
    author: 'Adrian',
  },
];

// Mock API responses
export const mockApiResponses = {
  posts: {
    success: {
      posts: mockBlogPosts,
      total: mockBlogPosts.length,
      page: 1,
      limit: 10,
    },
    empty: {
      posts: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    error: {
      error: 'Failed to fetch posts',
      message: 'Internal server error',
    },
  },
  search: {
    success: (query: string) => ({
      posts: mockBlogPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ),
      query,
      total: mockBlogPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).length,
    }),
    empty: (query: string) => ({
      posts: [],
      query,
      total: 0,
    }),
  },
};

// Mock navigation routes
export const mockRoutes = {
  home: '/',
  blog: '/blog',
  about: '/about',
  post: (slug: string) => `/blog/${slug}`,
  notFound: '/non-existent-page',
};

// Mock user interactions
export const mockUserActions = {
  search: {
    query: 'react',
    emptyQuery: 'xyz123nonexistent',
  },
  navigation: {
    validPaths: ['/', '/blog', '/about'],
    invalidPaths: ['/non-existent', '/blog/invalid-slug'],
  },
  filters: {
    tags: ['react', 'nextjs', 'typescript'],
    sortOptions: ['date-desc', 'date-asc', 'title-asc', 'title-desc'],
  },
};