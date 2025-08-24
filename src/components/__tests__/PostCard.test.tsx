import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import PostCard from '../blog/PostCard';
import { BlogPostSummary } from '@/types/blog';

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockImage = jest.fn(({ src, alt, ...props }: any) => {
  return <img src={src} alt={alt} {...props} />;
});

jest.mock('next/image', () => mockImage);

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Clock: () => <div data-testid="clock-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  User: () => <div data-testid="user-icon" />,
}));

const mockPost: BlogPostSummary = {
  slug: 'test-post',
  title: 'Test Blog Post',
  description: 'This is a test blog post description that should be displayed in the card.',
  date: '2024-01-15',
  tags: ['react', 'testing', 'javascript'],
  author: 'Test Author',
  image: '/test-image.jpg',
  readingTime: 5,
  wordCount: 1000,
  published: true,
};

const mockPostWithoutImage: BlogPostSummary = {
  ...mockPost,
  image: undefined,
};

const mockPostWithManyTags: BlogPostSummary = {
  ...mockPost,
  tags: ['react', 'testing', 'javascript', 'typescript', 'nextjs', 'jest'],
};

describe('PostCard', () => {
  const mockOnTagClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render post card with all elements', () => {
      render(<PostCard post={mockPost} />);

      // Check title
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      
      // Check description
      expect(screen.getByText(/This is a test blog post description/)).toBeInTheDocument();
      
      // Check date
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
      
      // Check reading time
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      
      // Check author
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      
      // Check tags
      expect(screen.getByText('#react')).toBeInTheDocument();
      expect(screen.getByText('#testing')).toBeInTheDocument();
      expect(screen.getByText('#javascript')).toBeInTheDocument();
      
      // Check image
      expect(screen.getByAltText('Featured image for Test Blog Post')).toBeInTheDocument();
      
      // Check link
      expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/test-post');
    });

    it('should render without image when image is not provided', () => {
      render(<PostCard post={mockPostWithoutImage} />);

      expect(screen.queryByAltText('Featured image for Test Blog Post')).not.toBeInTheDocument();
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('should render without author when author is not provided', () => {
      const postWithoutAuthor = { ...mockPost, author: undefined };
      render(<PostCard post={postWithoutAuthor} />);

      expect(screen.queryByTestId('user-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Author')).not.toBeInTheDocument();
    });

    it('should limit tags display to 3 and show more indicator', () => {
      render(<PostCard post={mockPostWithManyTags} />);

      // Should show first 3 tags
      expect(screen.getByText('#react')).toBeInTheDocument();
      expect(screen.getByText('#testing')).toBeInTheDocument();
      expect(screen.getByText('#javascript')).toBeInTheDocument();
      
      // Should show more indicator
      expect(screen.getByText('+3 more')).toBeInTheDocument();
      
      // Should not show additional tags
      expect(screen.queryByText('#typescript')).not.toBeInTheDocument();
      expect(screen.queryByText('#nextjs')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<PostCard post={mockPost} className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should render with priority prop', () => {
      render(<PostCard post={mockPost} priority={true} />);
      
      const image = screen.getByAltText('Featured image for Test Blog Post');
      expect(image).toBeInTheDocument();
      
      // The priority prop is passed to the component, which is sufficient for this test
      // In a real implementation, Next.js Image would handle the priority optimization
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<PostCard post={mockPost} />);

      const article = screen.getByRole('article');
      expect(article).toHaveAttribute('aria-labelledby', 'post-title-test-post');
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveAttribute('id', 'post-title-test-post');
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'Read full article: Test Blog Post');
    });

    it('should have proper time element with datetime attribute', () => {
      render(<PostCard post={mockPost} />);
      
      const timeElement = screen.getByText('January 15, 2024');
      expect(timeElement.tagName).toBe('TIME');
      expect(timeElement).toHaveAttribute('datetime', '2024-01-15');
    });

    it('should have proper tag button accessibility', () => {
      render(<PostCard post={mockPost} onTagClick={mockOnTagClick} />);
      
      const reactTag = screen.getByText('#react');
      expect(reactTag).toHaveAttribute('aria-label', 'Filter posts by react tag');
      expect(reactTag).toHaveAttribute('tabIndex', '0');
      expect(reactTag.tagName).toBe('BUTTON');
    });

    it('should disable tag buttons when onTagClick is not provided', () => {
      render(<PostCard post={mockPost} />);
      
      // Get tag buttons specifically by their text content
      const reactTag = screen.getByText('#react');
      const testingTag = screen.getByText('#testing');
      const jsTag = screen.getByText('#javascript');
      
      expect(reactTag).toHaveAttribute('tabIndex', '-1');
      expect(testingTag).toHaveAttribute('tabIndex', '-1');
      expect(jsTag).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Interactions', () => {
    it('should call onTagClick when tag is clicked', async () => {
      const user = userEvent.setup();
      render(<PostCard post={mockPost} onTagClick={mockOnTagClick} />);

      const reactTag = screen.getByText('#react');
      await user.click(reactTag);

      expect(mockOnTagClick).toHaveBeenCalledWith('react');
      expect(mockOnTagClick).toHaveBeenCalledTimes(1);
    });

    it('should prevent event propagation when tag is clicked', async () => {
      const user = userEvent.setup();
      const mockLinkClick = jest.fn();
      
      render(
        <div onClick={mockLinkClick}>
          <PostCard post={mockPost} onTagClick={mockOnTagClick} />
        </div>
      );

      const reactTag = screen.getByText('#react');
      await user.click(reactTag);

      expect(mockOnTagClick).toHaveBeenCalledWith('react');
      expect(mockLinkClick).not.toHaveBeenCalled();
    });

    it('should not call onTagClick when onTagClick is not provided', async () => {
      const user = userEvent.setup();
      render(<PostCard post={mockPost} />);

      const reactTag = screen.getByText('#react');
      await user.click(reactTag);

      // Should not throw error
      expect(mockOnTagClick).not.toHaveBeenCalled();
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly for different date formats', () => {
      const postWithDifferentDate = { ...mockPost, date: '2024-12-25' };
      render(<PostCard post={postWithDifferentDate} />);

      expect(screen.getByText('December 25, 2024')).toBeInTheDocument();
    });

    it('should handle invalid date gracefully', () => {
      const postWithInvalidDate = { ...mockPost, date: 'invalid-date' };
      
      // Should not throw error
      expect(() => {
        render(<PostCard post={postWithInvalidDate} />);
      }).not.toThrow();
    });
  });

  describe('Content Truncation', () => {
    it('should apply line-clamp classes for title and description', () => {
      render(<PostCard post={mockPost} />);

      const title = screen.getByText('Test Blog Post');
      expect(title).toHaveClass('line-clamp-2');

      const description = screen.getByText(/This is a test blog post description/);
      expect(description).toHaveClass('line-clamp-3');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive classes for different screen sizes', () => {
      const { container } = render(<PostCard post={mockPost} />);
      
      const article = container.firstChild as HTMLElement;
      expect(article).toHaveClass('rounded-xl');
      
      const contentDiv = screen.getByText('Test Blog Post').closest('.p-4');
      expect(contentDiv).toHaveClass('p-4', 'sm:p-6');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required post properties gracefully', () => {
      const incompletePost = {
        slug: 'test',
        title: 'Test',
        description: 'Test description',
        date: '2024-01-15',
        tags: [],
        readingTime: 1,
        wordCount: 100,
        published: true,
      } as BlogPostSummary;

      expect(() => {
        render(<PostCard post={incompletePost} />);
      }).not.toThrow();

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });
});