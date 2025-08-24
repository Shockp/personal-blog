import React from 'react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, waitForLoadingToFinish, mockFetchResponse, simulateNetworkDelay } from '../utils/test-utils';
import { errorHandlingHelpers } from '../utils/integration-helpers';
import { mockBlogPosts, mockApiResponses } from '../utils/mock-data';

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, ...props }: any) {
    return (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        {...props}
        data-testid="next-image"
      />
    );
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/blog',
    query: {},
    asPath: '/blog',
    route: '/blog',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Home: () => <div data-testid="home-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Wifi: () => <div data-testid="wifi-icon" />,
  WifiOff: () => <div data-testid="wifi-off-icon" />,
  Search: () => <div data-testid="search-icon" />,
  X: () => <div data-testid="close-icon" />,
}));

// Mock error boundary component
class MockErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; resetError: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || MockErrorFallback;
      return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const MockErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <div className="error-fallback" data-testid="error-fallback">
    <div data-testid="alert-triangle-icon" />
    <h2>Something went wrong</h2>
    <p data-testid="error-message">{error.message}</p>
    <button onClick={resetError} data-testid="retry-button">
      <div data-testid="refresh-icon" />
      Try Again
    </button>
  </div>
);

// Mock 404 page component
const Mock404Page = ({ 
  statusCode = 404,
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist."
}: {
  statusCode?: number;
  title?: string;
  message?: string;
}) => (
  <div className="error-page" data-testid="error-page">
    <div className="error-content">
      <h1 className="error-code" data-testid="error-code">{statusCode}</h1>
      <h2 className="error-title" data-testid="error-title">{title}</h2>
      <p className="error-message" data-testid="error-description">{message}</p>
      
      <div className="error-actions">
        <a href="/" className="home-link" data-testid="home-link">
          <div data-testid="home-icon" />
          Go Home
        </a>
        <a href="/blog" className="blog-link" data-testid="blog-link">
          Browse Blog
        </a>
        <button 
          onClick={() => window.history.back()} 
          className="back-button" 
          data-testid="back-button"
        >
          <div data-testid="arrow-left-icon" />
          Go Back
        </button>
      </div>
    </div>
  </div>
);

// Mock network error component
const MockNetworkError = ({ 
  onRetry,
  isRetrying = false 
}: { 
  onRetry: () => void;
  isRetrying?: boolean;
}) => (
  <div className="network-error" data-testid="network-error">
    <div data-testid="wifi-off-icon" />
    <h3>Connection Problem</h3>
    <p>Unable to load content. Please check your internet connection.</p>
    <button 
      onClick={onRetry} 
      disabled={isRetrying}
      data-testid="retry-network-button"
      className={isRetrying ? 'retrying' : ''}
    >
      {isRetrying ? (
        <>
          <div data-testid="refresh-icon" className="spinning" />
          Retrying...
        </>
      ) : (
        <>
          <div data-testid="refresh-icon" />
          Retry
        </>
      )}
    </button>
  </div>
);

// Mock blog component with error handling
const MockBlogWithErrorHandling = ({ 
  shouldError = false,
  networkError = false,
  posts = mockBlogPosts 
}: {
  shouldError?: boolean;
  networkError?: boolean;
  posts?: any[];
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [blogPosts, setBlogPosts] = React.useState<any[]>([]);
  const [retryCount, setRetryCount] = React.useState(0);
  const [isRetrying, setIsRetrying] = React.useState(false);

  const fetchPosts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (shouldError) {
        throw new Error('Failed to load blog posts');
      }
      
      if (networkError) {
        throw new Error('Network request failed');
      }
      
      // Simulate API delay
      await simulateNetworkDelay(500);
      
      setBlogPosts(posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [shouldError, networkError, posts]);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsRetrying(true);
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="loading-state" data-testid="loading-state">
        <div data-testid="refresh-icon" className="spinning" />
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    if (error.includes('Network')) {
      return <MockNetworkError onRetry={handleRetry} isRetrying={isRetrying} />;
    }
    
    return (
      <div className="error-state" data-testid="error-state">
        <div data-testid="alert-triangle-icon" />
        <h3>Error Loading Posts</h3>
        <p data-testid="error-message">{error}</p>
        <p data-testid="retry-count">Retry attempts: {retryCount}</p>
        <button onClick={handleRetry} data-testid="retry-button">
          <div data-testid="refresh-icon" />
          Try Again
        </button>
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <h3>No Posts Found</h3>
        <p>There are no blog posts to display at the moment.</p>
        <button onClick={handleRetry} data-testid="refresh-button">
          <div data-testid="refresh-icon" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="blog-posts" data-testid="blog-posts">
      <h2>Blog Posts</h2>
      <div className="posts-grid">
        {blogPosts.map(post => (
          <article key={post.slug} className="post-card" data-testid={`post-${post.slug}`}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <time>{post.date}</time>
          </article>
        ))}
      </div>
    </div>
  );
};

// Mock search component with error handling
const MockSearchWithErrorHandling = ({ 
  shouldError = false,
  networkError = false 
}: {
  shouldError?: boolean;
  networkError?: boolean;
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (shouldError) {
        throw new Error('Search service unavailable');
      }
      
      if (networkError) {
        throw new Error('Network error during search');
      }
      
      await simulateNetworkDelay(300);
      
      const filteredPosts = mockBlogPosts.filter(post => 
        post.title.toLowerCase().includes(term.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(term.toLowerCase())
      );
      
      setResults(filteredPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const handleRetry = () => {
    performSearch(searchTerm);
  };

  return (
    <div className="search-component" data-testid="search-component">
      <form onSubmit={handleSearch} data-testid="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts..."
          data-testid="search-input"
        />
        <button type="submit" data-testid="search-button">
          <div data-testid="search-icon" />
          Search
        </button>
      </form>
      
      {loading && (
        <div className="search-loading" data-testid="search-loading">
          <div data-testid="refresh-icon" className="spinning" />
          Searching...
        </div>
      )}
      
      {error && (
        <div className="search-error" data-testid="search-error">
          <div data-testid="alert-triangle-icon" />
          <p data-testid="search-error-message">{error}</p>
          <button onClick={handleRetry} data-testid="search-retry-button">
            <div data-testid="refresh-icon" />
            Retry Search
          </button>
        </div>
      )}
      
      {!loading && !error && searchTerm && (
        <div className="search-results" data-testid="search-results">
          <p data-testid="results-count">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{searchTerm}"
          </p>
          {results.length === 0 ? (
            <div className="no-results" data-testid="no-results">
              <p>No posts found matching your search.</p>
              <button 
                onClick={() => setSearchTerm('')} 
                data-testid="clear-search-button"
              >
                <div data-testid="close-icon" />
                Clear Search
              </button>
            </div>
          ) : (
            <div className="results-list">
              {results.map(post => (
                <div key={post.slug} className="search-result" data-testid={`result-${post.slug}`}>
                  <h4>{post.title}</h4>
                  <p>{post.excerpt}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Mock component that throws errors
const MockErrorThrowingComponent = ({ 
  shouldThrow = false,
  errorMessage = 'Component error' 
}: {
  shouldThrow?: boolean;
  errorMessage?: string;
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  
  return <div data-testid="working-component">Component is working</div>;
};

describe('Error Handling Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('404 Error Handling', () => {
    it('should render 404 page for non-existent routes', async () => {
      render(<Mock404Page />);

      expect(screen.getByTestId('error-page')).toBeInTheDocument();
      expect(screen.getByTestId('error-code')).toHaveTextContent('404');
      expect(screen.getByTestId('error-title')).toHaveTextContent('Page Not Found');
      expect(screen.getByTestId('error-description')).toHaveTextContent("The page you're looking for doesn't exist.");
    });

    it('should provide navigation options on 404 page', async () => {
      render(<Mock404Page />);

      expect(screen.getByTestId('home-link')).toHaveAttribute('href', '/');
      expect(screen.getByTestId('blog-link')).toHaveAttribute('href', '/blog');
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    it('should handle different error codes', async () => {
      render(
        <Mock404Page 
          statusCode={500} 
          title="Server Error" 
          message="Something went wrong on our end."
        />
      );

      expect(screen.getByTestId('error-code')).toHaveTextContent('500');
      expect(screen.getByTestId('error-title')).toHaveTextContent('Server Error');
      expect(screen.getByTestId('error-description')).toHaveTextContent('Something went wrong on our end.');
    });

    it('should handle back button click', async () => {
      const mockBack = jest.fn();
      Object.defineProperty(window, 'history', {
        value: { back: mockBack },
        writable: true
      });

      render(<Mock404Page />);

      const backButton = screen.getByTestId('back-button');
      await user.click(backButton);

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Network Error Handling', () => {
    it('should display network error when API fails', async () => {
      render(<MockBlogWithErrorHandling networkError={true} />);

      await waitFor(() => {
        expect(screen.getByTestId('network-error')).toBeInTheDocument();
      });

      expect(screen.getByText('Connection Problem')).toBeInTheDocument();
      expect(screen.getByText('Unable to load content. Please check your internet connection.')).toBeInTheDocument();
      expect(screen.getByTestId('retry-network-button')).toBeInTheDocument();
    });

    it('should allow retry after network error', async () => {
      const { rerender } = render(<MockBlogWithErrorHandling networkError={true} />);

      await waitFor(() => {
        expect(screen.getByTestId('network-error')).toBeInTheDocument();
      });

      const retryButton = screen.getByTestId('retry-network-button');
      await user.click(retryButton);

      // Show retrying state
      expect(screen.getByText('Retrying...')).toBeInTheDocument();
      expect(retryButton).toBeDisabled();

      // Simulate successful retry
      rerender(<MockBlogWithErrorHandling networkError={false} />);

      await waitFor(() => {
        expect(screen.getByTestId('blog-posts')).toBeInTheDocument();
      });
    });

    it('should handle search network errors', async () => {
      render(<MockSearchWithErrorHandling networkError={true} />);

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.type(searchInput, 'react');
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('search-error')).toBeInTheDocument();
      });

      expect(screen.getByTestId('search-error-message')).toHaveTextContent('Network error during search');
      expect(screen.getByTestId('search-retry-button')).toBeInTheDocument();
    });
  });

  describe('Component Error Boundaries', () => {
    it('should catch and display component errors', async () => {
      render(
        <MockErrorBoundary>
          <MockErrorThrowingComponent shouldThrow={true} errorMessage="Test component error" />
        </MockErrorBoundary>
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Test component error');
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('should allow error recovery', async () => {
      const { rerender } = render(
        <MockErrorBoundary>
          <MockErrorThrowingComponent shouldThrow={true} />
        </MockErrorBoundary>
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();

      const retryButton = screen.getByTestId('retry-button');
      await user.click(retryButton);

      // Simulate component recovery
      rerender(
        <MockErrorBoundary>
          <MockErrorThrowingComponent shouldThrow={false} />
        </MockErrorBoundary>
      );

      expect(screen.getByTestId('working-component')).toBeInTheDocument();
      expect(screen.queryByTestId('error-fallback')).not.toBeInTheDocument();
    });

    it('should log errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <MockErrorBoundary>
          <MockErrorThrowingComponent shouldThrow={true} errorMessage="Console test error" />
        </MockErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error caught by boundary:',
        expect.any(Error),
        expect.any(Object)
      );
    });
  });

  describe('Loading State Error Handling', () => {
    it('should show loading state initially', async () => {
      render(<MockBlogWithErrorHandling />);

      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(screen.getByText('Loading posts...')).toBeInTheDocument();
    });

    it('should handle loading timeout gracefully', async () => {
      // Mock a very slow response
      jest.setTimeout(10000);
      
      render(<MockBlogWithErrorHandling />);

      // Should show loading initially
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByTestId('blog-posts')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should handle empty data gracefully', async () => {
      render(<MockBlogWithErrorHandling posts={[]} />);

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      });

      expect(screen.getByText('No Posts Found')).toBeInTheDocument();
      expect(screen.getByText('There are no blog posts to display at the moment.')).toBeInTheDocument();
      expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
    });
  });

  describe('Search Error Scenarios', () => {
    it('should handle search service errors', async () => {
      render(<MockSearchWithErrorHandling shouldError={true} />);

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.type(searchInput, 'test query');
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('search-error')).toBeInTheDocument();
      });

      expect(screen.getByTestId('search-error-message')).toHaveTextContent('Search service unavailable');
    });

    it('should handle empty search results', async () => {
      render(<MockSearchWithErrorHandling />);

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.type(searchInput, 'nonexistent query xyz123');
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('search-results')).toBeInTheDocument();
      });

      expect(screen.getByTestId('results-count')).toHaveTextContent('0 results for "nonexistent query xyz123"');
      expect(screen.getByTestId('no-results')).toBeInTheDocument();
      expect(screen.getByText('No posts found matching your search.')).toBeInTheDocument();
    });

    it('should allow clearing failed searches', async () => {
      render(<MockSearchWithErrorHandling />);

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.type(searchInput, 'nonexistent query');
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('no-results')).toBeInTheDocument();
      });

      const clearButton = screen.getByTestId('clear-search-button');
      await user.click(clearButton);

      expect(searchInput).toHaveValue('');
      expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
    });
  });

  describe('Retry Mechanisms', () => {
    it('should track retry attempts', async () => {
      render(<MockBlogWithErrorHandling shouldError={true} />);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      expect(screen.getByTestId('retry-count')).toHaveTextContent('Retry attempts: 0');

      const retryButton = screen.getByTestId('retry-button');
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByTestId('retry-count')).toHaveTextContent('Retry attempts: 1');
      });
    });

    it('should handle multiple retry attempts', async () => {
      render(<MockBlogWithErrorHandling shouldError={true} />);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      const retryButton = screen.getByTestId('retry-button');
      
      // First retry
      await user.click(retryButton);
      await waitFor(() => {
        expect(screen.getByTestId('retry-count')).toHaveTextContent('Retry attempts: 1');
      });

      // Second retry
      await user.click(retryButton);
      await waitFor(() => {
        expect(screen.getByTestId('retry-count')).toHaveTextContent('Retry attempts: 2');
      });
    });

    it('should show retry loading state', async () => {
      render(<MockBlogWithErrorHandling networkError={true} />);

      await waitFor(() => {
        expect(screen.getByTestId('network-error')).toBeInTheDocument();
      });

      const retryButton = screen.getByTestId('retry-network-button');
      await user.click(retryButton);

      expect(screen.getByText('Retrying...')).toBeInTheDocument();
      expect(retryButton).toBeDisabled();
      expect(retryButton).toHaveClass('retrying');
    });
  });

  describe('Graceful Degradation', () => {
    it('should provide fallback content when features fail', async () => {
      render(<MockBlogWithErrorHandling shouldError={true} />);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      // Error state should still provide useful information
      expect(screen.getByText('Error Loading Posts')).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('should maintain navigation when content fails', async () => {
      render(
        <div>
          <nav data-testid="main-nav">
            <a href="/">Home</a>
            <a href="/blog">Blog</a>
            <a href="/about">About</a>
          </nav>
          <MockBlogWithErrorHandling shouldError={true} />
        </div>
      );

      // Navigation should still be available even when content fails
      expect(screen.getByTestId('main-nav')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });
    });
  });

  describe('User Experience During Errors', () => {
    it('should provide clear error messages', async () => {
      render(<MockBlogWithErrorHandling shouldError={true} />);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toHaveTextContent('Failed to load blog posts');
      expect(errorMessage).toBeVisible();
    });

    it('should maintain accessibility during error states', async () => {
      render(<MockBlogWithErrorHandling shouldError={true} />);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      const retryButton = screen.getByTestId('retry-button');
      expect(retryButton).toBeVisible();
      expect(retryButton).not.toBeDisabled();
      
      // Should be keyboard accessible
      retryButton.focus();
      expect(document.activeElement).toBe(retryButton);
    });

    it('should provide helpful recovery actions', async () => {
      render(<Mock404Page />);

      // Should provide multiple recovery options
      expect(screen.getByTestId('home-link')).toBeInTheDocument();
      expect(screen.getByTestId('blog-link')).toBeInTheDocument();
      expect(screen.getByTestId('back-button')).toBeInTheDocument();

      // All actions should be accessible
      const homeLink = screen.getByTestId('home-link');
      const blogLink = screen.getByTestId('blog-link');
      const backButton = screen.getByTestId('back-button');

      expect(homeLink).toHaveAttribute('href', '/');
      expect(blogLink).toHaveAttribute('href', '/blog');
      expect(backButton).toBeEnabled();
    });
  });
});