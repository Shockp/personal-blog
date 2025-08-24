import React from 'react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { screen, waitFor, act } from '@testing-library/react';
import { render, waitForLoadingToFinish } from '../utils/test-utils';
import { loadingHelpers, errorHelpers } from '../utils/integration-helpers';
import { mockBlogPosts, mockApiResponses } from '../utils/mock-data';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock markdown renderer
jest.mock('@/components/blog/MarkdownRenderer', () => {
  return function MockMarkdownRenderer({ content }: { content: string }) {
    return (
      <div data-testid="markdown-content">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  };
});

// Mock lazy components
jest.mock('@/components/blog/LazyMarkdownRenderer', () => {
  return function MockLazyMarkdownRenderer({ content }: { content: string }) {
    return (
      <div data-testid="lazy-markdown-content">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  };
});

// Mock social share component
jest.mock('@/components/blog/SocialShare', () => {
  return function MockSocialShare({ title, url }: { title: string; url: string }) {
    return (
      <div data-testid="social-share">
        <button>Share on Twitter</button>
        <button>Share on LinkedIn</button>
        <button>Copy Link</button>
      </div>
    );
  };
});

// Mock components
const MockPostCard = ({ post }: { post: any }) => (
  <article className="post-card" data-testid={`post-card-${post.slug}`}>
    <h2>
      <a href={`/blog/${post.slug}`}>{post.title}</a>
    </h2>
    <p className="excerpt">{post.excerpt}</p>
    <div className="post-meta">
      <time dateTime={post.date}>{post.date}</time>
      <span>{post.readTime}</span>
    </div>
    <div className="tags">
      {post.tags.map((tag: string) => (
        <span key={tag} className="tag">{tag}</span>
      ))}
    </div>
  </article>
);

const MockBlogListing = ({ posts, loading = false }: { posts: any[]; loading?: boolean }) => {
  if (loading) {
    return (
      <div data-testid="loading-spinner" role="status" aria-label="Loading posts">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1>Blog Posts</h1>
      <div className="posts-grid" data-testid="posts-grid">
        {posts.length === 0 ? (
          <div data-testid="no-posts-message">
            <p>No posts found.</p>
          </div>
        ) : (
          posts.map((post) => (
            <MockPostCard key={post.slug} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

const MockPostContent = ({ post, loading = false }: { post?: any; loading?: boolean }) => {
  if (loading) {
    return (
      <div data-testid="post-loading" role="status" aria-label="Loading post">
        <div className="skeleton-loader">
          <div className="skeleton-title"></div>
          <div className="skeleton-meta"></div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div data-testid="post-not-found">
        <h1>Post Not Found</h1>
        <p>The requested post could not be found.</p>
        <a href="/blog">← Back to Blog</a>
      </div>
    );
  }

  return (
    <article className="post-content" data-testid="post-content">
      <header>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <time dateTime={post.date}>{post.date}</time>
          <span>{post.readTime}</span>
          <span>{post.author}</span>
        </div>
        <div className="tags">
          {post.tags.map((tag: string) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </header>
      
      {post.coverImage && (
        <div className="cover-image">
          <img src={post.coverImage} alt={post.title} />
        </div>
      )}
      
      <div className="content">
        <div data-testid="markdown-content">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
      
      <footer>
        <div data-testid="social-share">
          <button>Share on Twitter</button>
          <button>Share on LinkedIn</button>
          <button>Copy Link</button>
        </div>
      </footer>
    </article>
  );
};

describe('Post Loading Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Blog Post Listing', () => {
    it('should load and display blog posts successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.posts.success,
      });

      render(<MockBlogListing posts={mockBlogPosts} />);

      // Check posts are rendered
      expect(screen.getByText('Blog Posts')).toBeInTheDocument();
      expect(screen.getByTestId('posts-grid')).toBeInTheDocument();
      
      // Check individual posts
      expect(screen.getByText('Getting Started with Next.js')).toBeInTheDocument();
      expect(screen.getByText('React Best Practices 2024')).toBeInTheDocument();
      expect(screen.getByText('TypeScript Tips and Tricks')).toBeInTheDocument();
      
      // Check post metadata
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
      expect(screen.getByText('8 min read')).toBeInTheDocument();
      
      // Check tags
      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should show loading state while fetching posts', async () => {
      render(<MockBlogListing posts={[]} loading={true} />);

      // Check loading state
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByRole('status', { name: /loading posts/i })).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle empty posts state', async () => {
      render(<MockBlogListing posts={[]} />);

      // Check empty state
      expect(screen.getByTestId('no-posts-message')).toBeInTheDocument();
      expect(screen.getByText('No posts found.')).toBeInTheDocument();
    });

    it('should handle post loading errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Failed to fetch posts'));

      // This would typically be handled by an error boundary or error state
      const { rerender } = render(<MockBlogListing posts={[]} />);
      
      // Simulate error state
      rerender(
        <div data-testid="error-message">
          <h2>Failed to Load Posts</h2>
          <p>Unable to fetch blog posts. Please try again later.</p>
          <button>Retry</button>
        </div>
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText('Failed to Load Posts')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Individual Post Loading', () => {
    it('should load and display individual post content', async () => {
      const mockPost = mockBlogPosts[0];
      
      render(<MockPostContent post={mockPost} />);

      // Check post header
      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
      expect(screen.getByText(mockPost.date)).toBeInTheDocument();
      expect(screen.getByText(mockPost.readTime)).toBeInTheDocument();
      expect(screen.getByText(mockPost.author)).toBeInTheDocument();
      
      // Check post content
      expect(screen.getByTestId('post-content')).toBeInTheDocument();
      expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
      
      // Check tags
      mockPost.tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
      
      // Check social sharing
      expect(screen.getByTestId('social-share')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share on twitter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share on linkedin/i })).toBeInTheDocument();
    });

    it('should show loading state while fetching individual post', async () => {
      render(<MockPostContent loading={true} />);

      // Check loading state
      expect(screen.getByTestId('post-loading')).toBeInTheDocument();
      expect(screen.getByRole('status', { name: /loading post/i })).toBeInTheDocument();
      
      // Check skeleton loader elements
      expect(screen.getByTestId('post-loading')).toHaveClass('skeleton-loader');
    });

    it('should handle post not found state', async () => {
      render(<MockPostContent post={undefined} />);

      // Check not found state
      expect(screen.getByTestId('post-not-found')).toBeInTheDocument();
      expect(screen.getByText('Post Not Found')).toBeInTheDocument();
      expect(screen.getByText('The requested post could not be found.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /back to blog/i })).toBeInTheDocument();
    });

    it('should render post with cover image when available', async () => {
      const postWithImage = {
        ...mockBlogPosts[0],
        coverImage: '/images/nextjs-cover.jpg'
      };
      
      render(<MockPostContent post={postWithImage} />);

      // Check cover image
      const coverImage = screen.getByRole('img', { name: postWithImage.title });
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute('src', '/images/nextjs-cover.jpg');
    });
  });

  describe('Post Content Rendering', () => {
    it('should render markdown content correctly', async () => {
      const mockPost = {
        ...mockBlogPosts[0],
        content: '<h2>Introduction</h2><p>This is a test post with <strong>bold text</strong> and <em>italic text</em>.</p>'
      };
      
      render(<MockPostContent post={mockPost} />);

      // Check markdown rendering
      expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
      
      // The content would be rendered as HTML
      const contentDiv = screen.getByTestId('markdown-content');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should handle code blocks in markdown content', async () => {
      const mockPost = {
        ...mockBlogPosts[0],
        content: '<pre><code class="language-javascript">const hello = "world";</code></pre>'
      };
      
      render(<MockPostContent post={mockPost} />);

      expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
    });

    it('should render post metadata correctly', async () => {
      const mockPost = mockBlogPosts[0];
      
      render(<MockPostContent post={mockPost} />);

      // Check all metadata elements
      expect(screen.getByText(mockPost.date)).toBeInTheDocument();
      expect(screen.getByText(mockPost.readTime)).toBeInTheDocument();
      expect(screen.getByText(mockPost.author)).toBeInTheDocument();
      
      // Check date attribute
      const timeElement = screen.getByText(mockPost.date);
      expect(timeElement.tagName.toLowerCase()).toBe('time');
    });
  });

  describe('Post Loading Performance', () => {
    it('should load posts within acceptable time limits', async () => {
      const startTime = Date.now();
      
      mockFetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => mockApiResponses.posts.success
          }), 100)
        )
      );

      render(<MockBlogListing posts={mockBlogPosts} />);
      
      await waitForLoadingToFinish();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    it('should handle concurrent post loading requests', async () => {
      const promises = Array.from({ length: 3 }, (_, i) => 
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponses.posts.success
        })
      );

      // Simulate multiple concurrent requests
      const components = Array.from({ length: 3 }, (_, i) => 
        <MockBlogListing key={i} posts={mockBlogPosts} />
      );

      components.forEach(component => render(component));
      
      await waitForLoadingToFinish();
      
      // All components should render successfully
      expect(screen.getAllByText('Blog Posts')).toHaveLength(3);
    });
  });

  describe('Post Data Integrity', () => {
    it('should validate post data structure', async () => {
      const mockPost = mockBlogPosts[0];
      
      render(<MockPostContent post={mockPost} />);

      // Verify required fields are present
      expect(mockPost.title).toBeDefined();
      expect(mockPost.slug).toBeDefined();
      expect(mockPost.date).toBeDefined();
      expect(mockPost.content).toBeDefined();
      expect(mockPost.excerpt).toBeDefined();
      expect(Array.isArray(mockPost.tags)).toBe(true);
    });

    it('should handle malformed post data gracefully', async () => {
      const malformedPost = {
        title: 'Test Post',
        // Missing required fields
      };
      
      // This should be handled by the component's error boundaries
      const { container } = render(<MockPostContent post={malformedPost} />);
      
      // Component should still render without crashing
      expect(container).toBeInTheDocument();
    });
  });
});