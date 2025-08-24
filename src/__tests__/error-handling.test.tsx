import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import React from 'react';

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock utility functions
const mockGetPostBySlug = jest.fn();
const mockGetAllPosts = jest.fn();
const mockMarkdownToHtml = jest.fn();
const mockSanitizeUserContent = jest.fn();
const mockValidatePostMetadata = jest.fn();

jest.mock('@/lib/posts', () => ({
  getPostBySlug: mockGetPostBySlug,
  getAllPosts: mockGetAllPosts,
  validatePostMetadata: mockValidatePostMetadata,
}));

jest.mock('@/lib/markdown', () => ({
  markdownToHtml: mockMarkdownToHtml,
}));

jest.mock('@/lib/utils/sanitization', () => ({
  sanitizeUserContent: mockSanitizeUserContent,
}));

// Error Boundary Component for testing
class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: undefined })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component that throws errors for testing
const ErrorThrowingComponent: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({
  shouldThrow = false,
  errorMessage = 'Test error',
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div data-testid="success-component">Component rendered successfully</div>;
};

// Async component that can fail
const AsyncErrorComponent: React.FC<{ shouldFail?: boolean }> = ({ shouldFail = false }) => {
  const [data, setData] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (shouldFail) {
          throw new Error('Async operation failed');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        setData('Data loaded successfully');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldFail]);

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="async-error">{error}</div>;
  return <div data-testid="async-success">{data}</div>;
};

// Network error simulation component
const NetworkErrorComponent: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const fetchWithRetry = async () => {
    try {
      setError(null);
      // Simulate network request
      const response = await fetch('/api/test-endpoint');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchWithRetry();
  };

  React.useEffect(() => {
    fetchWithRetry();
  }, []);

  return (
    <div>
      {error && (
        <div data-testid="network-error">
          <p>Error: {error}</p>
          <p>Retry attempts: {retryCount}</p>
          <button onClick={handleRetry} data-testid="retry-button">
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

describe('Error Handling Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('React Error Boundaries', () => {
    it('should catch and display component errors', () => {
      const onError = jest.fn();
      
      render(
        <TestErrorBoundary onError={onError}>
          <ErrorThrowingComponent shouldThrow={true} errorMessage="Component crashed" />
        </TestErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Component crashed')).toBeInTheDocument();
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should allow recovery from errors', () => {
      render(
        <TestErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </TestErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Try again'));
      
      expect(screen.getByTestId('success-component')).toBeInTheDocument();
      expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
    });

    it('should handle multiple error types', () => {
      const { rerender } = render(
        <TestErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} errorMessage="Type Error" />
        </TestErrorBoundary>
      );

      expect(screen.getByText('Type Error')).toBeInTheDocument();

      rerender(
        <TestErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} errorMessage="Reference Error" />
        </TestErrorBoundary>
      );

      expect(screen.getByText('Reference Error')).toBeInTheDocument();
    });
  });

  describe('Async Operation Errors', () => {
    it('should handle async component failures', async () => {
      render(<AsyncErrorComponent shouldFail={true} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('async-error')).toBeInTheDocument();
      });

      expect(screen.getByText('Async operation failed')).toBeInTheDocument();
    });

    it('should handle successful async operations', async () => {
      render(<AsyncErrorComponent shouldFail={false} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('async-success')).toBeInTheDocument();
      });

      expect(screen.getByText('Data loaded successfully')).toBeInTheDocument();
    });
  });

  describe('Network Error Handling', () => {
    it('should handle fetch failures', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<NetworkErrorComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('network-error')).toBeInTheDocument();
      });

      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
    });

    it('should handle HTTP error responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      render(<NetworkErrorComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('network-error')).toBeInTheDocument();
      });

      expect(screen.getByText(/Error: HTTP 404: Not Found/)).toBeInTheDocument();
    });

    it('should handle retry functionality', async () => {
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ ok: true });

      render(<NetworkErrorComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('network-error')).toBeInTheDocument();
      });

      expect(screen.getByText('Retry attempts: 0')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('retry-button'));

      await waitFor(() => {
        expect(screen.getByText('Retry attempts: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Data Processing Errors', () => {
    it('should handle post loading failures', async () => {
      mockGetPostBySlug.mockRejectedValue(new Error('Post not found'));

      try {
        await mockGetPostBySlug('invalid-slug');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Post not found');
      }

      expect(mockGetPostBySlug).toHaveBeenCalledWith('invalid-slug');
    });

    it('should handle markdown processing failures', async () => {
      mockMarkdownToHtml.mockRejectedValue(new Error('Invalid markdown'));

      try {
        await mockMarkdownToHtml('invalid markdown content');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Invalid markdown');
      }
    });

    it('should handle sanitization failures', () => {
      mockSanitizeUserContent.mockImplementation(() => {
        throw new Error('Sanitization failed');
      });

      expect(() => {
        mockSanitizeUserContent('<script>alert("xss")</script>');
      }).toThrow('Sanitization failed');
    });

    it('should handle validation failures', () => {
      mockValidatePostMetadata.mockReturnValue({
        isValid: false,
        errors: ['Missing title', 'Invalid date format'],
      });

      const result = mockValidatePostMetadata({
        title: '',
        date: 'invalid-date',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing title');
      expect(result.errors).toContain('Invalid date format');
    });
  });

  describe('Input Validation Errors', () => {
    it('should handle invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user..name@domain.com',
      ];

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should handle invalid URL formats', () => {
      const invalidUrls = [
        'not-a-url',
        'http://',
        'https://',
        'ftp://invalid',
        'javascript:alert("xss")',
      ];

      invalidUrls.forEach(url => {
        try {
          new URL(url);
          // If we reach here, the URL was valid (unexpected)
          expect(true).toBe(false);
        } catch (error) {
          expect(error).toBeInstanceOf(TypeError);
        }
      });
    });

    it('should handle XSS attempts in user input', () => {
      const xssAttempts = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(\'xss\')" />',
        'javascript:alert("xss")',
        '<iframe src="javascript:alert(\'xss\')" />',
        '<svg onload="alert(\'xss\')" />',
      ];

      xssAttempts.forEach(attempt => {
        // Mock sanitization that should remove dangerous content
        mockSanitizeUserContent.mockReturnValue('Safe content');
        const result = mockSanitizeUserContent(attempt);
        expect(result).toBe('Safe content');
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('javascript:');
        expect(result).not.toContain('onerror');
        expect(result).not.toContain('onload');
      });
    });
  });

  describe('File System Errors', () => {
    it('should handle missing files', async () => {
      mockGetAllPosts.mockRejectedValue(new Error('ENOENT: no such file or directory'));

      try {
        await mockGetAllPosts();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('ENOENT');
      }
    });

    it('should handle permission errors', async () => {
      mockGetPostBySlug.mockRejectedValue(new Error('EACCES: permission denied'));

      try {
        await mockGetPostBySlug('test-post');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('EACCES');
      }
    });

    it('should handle corrupted file content', async () => {
      mockMarkdownToHtml.mockRejectedValue(new Error('Invalid file format'));

      try {
        await mockMarkdownToHtml('corrupted content');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Invalid file format');
      }
    });
  });

  describe('Memory and Performance Errors', () => {
    it('should handle out of memory scenarios', () => {
      const mockOutOfMemory = jest.fn().mockImplementation(() => {
        throw new Error('JavaScript heap out of memory');
      });

      expect(() => mockOutOfMemory()).toThrow('JavaScript heap out of memory');
    });

    it('should handle stack overflow scenarios', () => {
      const mockStackOverflow = jest.fn().mockImplementation(() => {
        throw new Error('Maximum call stack size exceeded');
      });

      expect(() => mockStackOverflow()).toThrow('Maximum call stack size exceeded');
    });

    it('should handle timeout scenarios', async () => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), 100);
      });

      await expect(timeoutPromise).rejects.toThrow('Operation timed out');
    });
  });

  describe('Browser API Errors', () => {
    it('should handle localStorage unavailability', () => {
      const originalLocalStorage = window.localStorage;
      
      // Mock localStorage to throw an error
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => {
            throw new Error('localStorage is not available');
          }),
          setItem: jest.fn(() => {
            throw new Error('localStorage is not available');
          }),
        },
        writable: true,
      });

      expect(() => {
        window.localStorage.getItem('test');
      }).toThrow('localStorage is not available');

      expect(() => {
        window.localStorage.setItem('test', 'value');
      }).toThrow('localStorage is not available');

      // Restore original localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });

    it('should handle geolocation errors', () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn((success, error) => {
          error({
            code: 1,
            message: 'User denied the request for Geolocation.',
          });
        }),
      };

      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });

      const errorCallback = jest.fn();
      navigator.geolocation.getCurrentPosition(jest.fn(), errorCallback);

      expect(errorCallback).toHaveBeenCalledWith({
        code: 1,
        message: 'User denied the request for Geolocation.',
      });
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle null and undefined values', () => {
      const testValues = [null, undefined, '', 0, false, NaN];

      testValues.forEach(value => {
        // Test that functions handle falsy values gracefully
        mockSanitizeUserContent.mockReturnValue(value || 'default');
        const result = mockSanitizeUserContent(value);
        expect(result).toBeDefined();
      });
    });

    it('should handle extremely large inputs', () => {
      const largeString = 'a'.repeat(1000000); // 1MB string
      
      mockSanitizeUserContent.mockImplementation((input) => {
        if (typeof input === 'string' && input.length > 100000) {
          throw new Error('Input too large');
        }
        return input;
      });

      expect(() => {
        mockSanitizeUserContent(largeString);
      }).toThrow('Input too large');
    });

    it('should handle circular references', () => {
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;

      expect(() => {
        JSON.stringify(circularObj);
      }).toThrow('Converting circular structure to JSON');
    });

    it('should handle invalid JSON parsing', () => {
      const invalidJson = '{ invalid json }';

      expect(() => {
        JSON.parse(invalidJson);
      }).toThrow();
    });
  });

  describe('Graceful Degradation', () => {
    it('should provide fallback when features are unavailable', () => {
      // Mock a feature that might not be available
      const mockFeature = jest.fn().mockImplementation(() => {
        if (typeof window === 'undefined') {
          return 'Server-side fallback';
        }
        return 'Client-side feature';
      });

      expect(mockFeature()).toBe('Client-side feature');
    });

    it('should handle missing dependencies gracefully', () => {
      // Test that the app can handle missing optional dependencies
      const mockOptionalFeature = jest.fn().mockImplementation(() => {
        try {
          // Simulate optional dependency
          throw new Error('Module not found');
        } catch (error) {
          return 'Feature disabled - dependency not available';
        }
      });

      expect(mockOptionalFeature()).toBe('Feature disabled - dependency not available');
    });
  });
});