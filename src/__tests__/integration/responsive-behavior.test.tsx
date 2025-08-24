import React from 'react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockWindowSize, VIEWPORT_SIZES } from '../utils/test-utils';
import { responsiveHelpers } from '../utils/integration-helpers';
import { mockBlogPosts } from '../utils/mock-data';

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

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="close-icon" />,
  Search: () => <div data-testid="search-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Tag: () => <div data-testid="tag-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
}));

// Mock responsive components
const MockResponsiveHeader = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className={`header ${isMobile ? 'mobile' : 'desktop'}`} data-testid="header">
      <div className="header-container">
        <div className="logo">
          <a href="/" data-testid="logo-link">Adrian</a>
        </div>
        
        {isMobile ? (
          <>
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <div data-testid="close-icon" /> : <div data-testid="menu-icon" />}
            </button>
            
            {mobileMenuOpen && (
              <nav className="mobile-nav" data-testid="mobile-nav">
                <a href="/" onClick={() => setMobileMenuOpen(false)}>Home</a>
                <a href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</a>
                <a href="/about" onClick={() => setMobileMenuOpen(false)}>About</a>
                <button data-testid="mobile-theme-toggle">Theme</button>
              </nav>
            )}
          </>
        ) : (
          <>
            <nav className="desktop-nav" data-testid="desktop-nav">
              <a href="/">Home</a>
              <a href="/blog">Blog</a>
              <a href="/about">About</a>
            </nav>
            <button data-testid="desktop-theme-toggle">Theme</button>
          </>
        )}
      </div>
    </header>
  );
};

const MockResponsiveBlogGrid = ({ 
  posts, 
  columns = 'auto',
  isMobile = false 
}: { 
  posts: any[]; 
  columns?: string;
  isMobile?: boolean;
}) => {
  const gridClass = isMobile ? 'blog-grid-mobile' : `blog-grid-${columns}`;
  
  return (
    <div className={`blog-grid ${gridClass}`} data-testid="blog-grid">
      {posts.map(post => (
        <article 
          key={post.slug} 
          className={`post-card ${isMobile ? 'mobile' : 'desktop'}`}
          data-testid={`post-card-${post.slug}`}
        >
          {post.coverImage && (
            <div className="post-image">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className={isMobile ? 'mobile-image' : 'desktop-image'}
                data-testid="post-cover-image"
              />
            </div>
          )}
          <div className="post-content">
            <h2 className={isMobile ? 'mobile-title' : 'desktop-title'}>
              <a href={`/blog/${post.slug}`}>{post.title}</a>
            </h2>
            <p className={`excerpt ${isMobile ? 'mobile-excerpt' : 'desktop-excerpt'}`}>
              {post.excerpt}
            </p>
            <div className={`post-meta ${isMobile ? 'mobile-meta' : 'desktop-meta'}`}>
              <time>{post.date}</time>
              <span>{post.readTime}</span>
            </div>
            <div className={`tags ${isMobile ? 'mobile-tags' : 'desktop-tags'}`}>
              {post.tags.slice(0, isMobile ? 2 : 4).map((tag: string) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
              {isMobile && post.tags.length > 2 && (
                <span className="tag-more">+{post.tags.length - 2}</span>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

const MockResponsiveSearchPanel = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(!isMobile);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const allTags = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'];

  return (
    <div className={`search-panel ${isMobile ? 'mobile' : 'desktop'}`} data-testid="search-panel">
      {isMobile && (
        <button
          className="search-panel-toggle"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="search-panel-toggle"
          aria-expanded={isOpen}
        >
          <div data-testid="search-icon" />
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      )}
      
      {isOpen && (
        <div className={`search-content ${isMobile ? 'mobile-search' : 'desktop-search'}`}>
          <div className="search-input-section">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className={isMobile ? 'mobile-search-input' : 'desktop-search-input'}
              data-testid="search-input"
            />
          </div>
          
          <div className="filter-section">
            <h3>Tags</h3>
            <div className={`tag-filters ${isMobile ? 'mobile-tags' : 'desktop-tags'}`}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''} ${
                    isMobile ? 'mobile-tag' : 'desktop-tag'
                  }`}
                  data-testid={`tag-filter-${tag.toLowerCase().replace('.', '')}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="sort-section">
            <h3>Sort By</h3>
            <select 
              className={isMobile ? 'mobile-select' : 'desktop-select'}
              data-testid="sort-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

const MockResponsivePostContent = ({ 
  post, 
  isMobile = false 
}: { 
  post: any; 
  isMobile?: boolean;
}) => {
  return (
    <article className={`post-content ${isMobile ? 'mobile' : 'desktop'}`} data-testid="post-content">
      <header className={`post-header ${isMobile ? 'mobile-header' : 'desktop-header'}`}>
        <h1 className={isMobile ? 'mobile-title' : 'desktop-title'}>{post.title}</h1>
        <div className={`post-meta ${isMobile ? 'mobile-meta' : 'desktop-meta'}`}>
          <time>{post.date}</time>
          <span>{post.readTime}</span>
          <span>{post.author}</span>
        </div>
      </header>
      
      {post.coverImage && (
        <div className={`cover-image ${isMobile ? 'mobile-cover' : 'desktop-cover'}`}>
          <img 
            src={post.coverImage} 
            alt={post.title}
            className={isMobile ? 'mobile-image' : 'desktop-image'}
            data-testid="cover-image"
          />
        </div>
      )}
      
      <div className={`content ${isMobile ? 'mobile-content' : 'desktop-content'}`}>
        <div className={`prose ${isMobile ? 'mobile-prose' : 'desktop-prose'}`}>
          {post.content}
        </div>
      </div>
      
      <footer className={`post-footer ${isMobile ? 'mobile-footer' : 'desktop-footer'}`}>
        <div className="social-share" data-testid="social-share">
          <button className={isMobile ? 'mobile-share-btn' : 'desktop-share-btn'}>Share</button>
        </div>
        
        <nav className={`post-navigation ${isMobile ? 'mobile-nav' : 'desktop-nav'}`}>
          <a href="/blog" className={isMobile ? 'mobile-back-btn' : 'desktop-back-btn'}>
            <div data-testid="arrow-left-icon" />
            Back to Blog
          </a>
        </nav>
      </footer>
    </article>
  );
};

describe('Responsive Behavior Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Reset viewport size
    mockWindowSize(VIEWPORT_SIZES.desktop.width, VIEWPORT_SIZES.desktop.height);
  });

  describe('Mobile Viewport (320px - 768px)', () => {
    beforeEach(() => {
      mockWindowSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height);
    });

    it('should render mobile header with hamburger menu', async () => {
      render(<MockResponsiveHeader isMobile={true} />);

      expect(screen.getByTestId('header')).toHaveClass('mobile');
      expect(screen.getByTestId('mobile-menu-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-nav')).not.toBeInTheDocument();
    });

    it('should toggle mobile menu on hamburger click', async () => {
      render(<MockResponsiveHeader isMobile={true} />);

      const menuToggle = screen.getByTestId('mobile-menu-toggle');
      expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();

      await user.click(menuToggle);
      expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
      expect(menuToggle).toHaveAttribute('aria-expanded', 'true');

      await user.click(menuToggle);
      expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
      expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('should close mobile menu when navigation link is clicked', async () => {
      render(<MockResponsiveHeader isMobile={true} />);

      const menuToggle = screen.getByTestId('mobile-menu-toggle');
      await user.click(menuToggle);
      
      const blogLink = screen.getByRole('link', { name: 'Blog' });
      await user.click(blogLink);
      
      expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    });

    it('should render blog posts in single column on mobile', async () => {
      render(<MockResponsiveBlogGrid posts={mockBlogPosts} isMobile={true} />);

      const blogGrid = screen.getByTestId('blog-grid');
      expect(blogGrid).toHaveClass('blog-grid-mobile');
      
      const postCards = screen.getAllByTestId(/post-card-/);
      postCards.forEach(card => {
        expect(card).toHaveClass('mobile');
      });
    });

    it('should limit tags displayed on mobile post cards', async () => {
      const postWithManyTags = {
        ...mockBlogPosts[0],
        tags: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'CSS', 'Node.js']
      };
      
      render(<MockResponsiveBlogGrid posts={[postWithManyTags]} isMobile={true} />);

      // Should show only 2 tags + "more" indicator
      const tags = screen.getAllByText(/React|Next\.js/);
      expect(tags.length).toBeLessThanOrEqual(2);
      expect(screen.getByText('+4')).toBeInTheDocument();
    });

    it('should render collapsible search panel on mobile', async () => {
      render(<MockResponsiveSearchPanel isMobile={true} />);

      expect(screen.getByTestId('search-panel')).toHaveClass('mobile');
      expect(screen.getByTestId('search-panel-toggle')).toBeInTheDocument();
      expect(screen.getByText('Show Filters')).toBeInTheDocument();
      
      // Search content should be hidden initially
      expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
    });

    it('should expand search panel when toggle is clicked on mobile', async () => {
      render(<MockResponsiveSearchPanel isMobile={true} />);

      const toggle = screen.getByTestId('search-panel-toggle');
      await user.click(toggle);
      
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByText('Hide Filters')).toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('should render mobile-optimized post content', async () => {
      const mockPost = mockBlogPosts[0];
      render(<MockResponsivePostContent post={mockPost} isMobile={true} />);

      expect(screen.getByTestId('post-content')).toHaveClass('mobile');
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('mobile-title');
      
      const prose = document.querySelector('.prose');
      expect(prose).toHaveClass('mobile-prose');
    });
  });

  describe('Tablet Viewport (768px - 1024px)', () => {
    beforeEach(() => {
      mockWindowSize(VIEWPORT_SIZES.tablet.width, VIEWPORT_SIZES.tablet.height);
    });

    it('should render desktop header on tablet', async () => {
      render(<MockResponsiveHeader isMobile={false} />);

      expect(screen.getByTestId('header')).toHaveClass('desktop');
      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-menu-toggle')).not.toBeInTheDocument();
    });

    it('should render blog posts in 2-column grid on tablet', async () => {
      render(<MockResponsiveBlogGrid posts={mockBlogPosts} columns="2" />);

      const blogGrid = screen.getByTestId('blog-grid');
      expect(blogGrid).toHaveClass('blog-grid-2');
      
      const postCards = screen.getAllByTestId(/post-card-/);
      postCards.forEach(card => {
        expect(card).toHaveClass('desktop');
      });
    });

    it('should show expanded search panel on tablet', async () => {
      render(<MockResponsiveSearchPanel isMobile={false} />);

      expect(screen.getByTestId('search-panel')).toHaveClass('desktop');
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.queryByTestId('search-panel-toggle')).not.toBeInTheDocument();
    });
  });

  describe('Desktop Viewport (1024px+)', () => {
    beforeEach(() => {
      mockWindowSize(VIEWPORT_SIZES.desktop.width, VIEWPORT_SIZES.desktop.height);
    });

    it('should render full desktop header', async () => {
      render(<MockResponsiveHeader isMobile={false} />);

      expect(screen.getByTestId('header')).toHaveClass('desktop');
      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
      expect(screen.getByTestId('desktop-theme-toggle')).toBeInTheDocument();
    });

    it('should render blog posts in 3-column grid on desktop', async () => {
      render(<MockResponsiveBlogGrid posts={mockBlogPosts} columns="3" />);

      const blogGrid = screen.getByTestId('blog-grid');
      expect(blogGrid).toHaveClass('blog-grid-3');
    });

    it('should show all tags on desktop post cards', async () => {
      const postWithManyTags = {
        ...mockBlogPosts[0],
        tags: ['React', 'Next.js', 'TypeScript', 'JavaScript']
      };
      
      render(<MockResponsiveBlogGrid posts={[postWithManyTags]} />);

      // Should show all 4 tags (desktop limit)
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
    });

    it('should render full-width post content on desktop', async () => {
      const mockPost = mockBlogPosts[0];
      render(<MockResponsivePostContent post={mockPost} isMobile={false} />);

      expect(screen.getByTestId('post-content')).toHaveClass('desktop');
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('desktop-title');
      
      const prose = document.querySelector('.prose');
      expect(prose).toHaveClass('desktop-prose');
    });
  });

  describe('Viewport Transitions', () => {
    it('should adapt layout when resizing from desktop to mobile', async () => {
      // Start with desktop
      mockWindowSize(VIEWPORT_SIZES.desktop.width, VIEWPORT_SIZES.desktop.height);
      const { rerender } = render(<MockResponsiveHeader isMobile={false} />);
      
      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
      
      // Resize to mobile
      mockWindowSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height);
      rerender(<MockResponsiveHeader isMobile={true} />);
      
      expect(screen.getByTestId('mobile-menu-toggle')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-nav')).not.toBeInTheDocument();
    });

    it('should adapt blog grid when resizing from mobile to desktop', async () => {
      // Start with mobile
      mockWindowSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height);
      const { rerender } = render(<MockResponsiveBlogGrid posts={mockBlogPosts} isMobile={true} />);
      
      expect(screen.getByTestId('blog-grid')).toHaveClass('blog-grid-mobile');
      
      // Resize to desktop
      mockWindowSize(VIEWPORT_SIZES.desktop.width, VIEWPORT_SIZES.desktop.height);
      rerender(<MockResponsiveBlogGrid posts={mockBlogPosts} columns="3" />);
      
      expect(screen.getByTestId('blog-grid')).toHaveClass('blog-grid-3');
    });
  });

  describe('Touch and Interaction Adaptations', () => {
    it('should have larger touch targets on mobile', async () => {
      mockWindowSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height);
      render(<MockResponsiveSearchPanel isMobile={true} />);

      const toggle = screen.getByTestId('search-panel-toggle');
      await user.click(toggle);
      
      const tagFilters = screen.getAllByTestId(/tag-filter-/);
      tagFilters.forEach(filter => {
        expect(filter).toHaveClass('mobile-tag');
      });
    });

    it('should support swipe gestures on mobile (simulated)', async () => {
      mockWindowSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height);
      render(<MockResponsiveHeader isMobile={true} />);

      const menuToggle = screen.getByTestId('mobile-menu-toggle');
      
      // Simulate touch events
      fireEvent.touchStart(menuToggle);
      fireEvent.touchEnd(menuToggle);
      
      // Menu should toggle
      expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
    });
  });

  describe('Content Reflow and Typography', () => {
    it('should adjust typography for mobile readability', async () => {
      mockWindowSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height);
      const mockPost = mockBlogPosts[0];
      render(<MockResponsivePostContent post={mockPost} isMobile={true} />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('mobile-title');
      
      const content = document.querySelector('.content');
      expect(content).toHaveClass('mobile-content');
    });

    it('should maintain proper line length on desktop', async () => {
      mockWindowSize(VIEWPORT_SIZES.desktop.width, VIEWPORT_SIZES.desktop.height);
      const mockPost = mockBlogPosts[0];
      render(<MockResponsivePostContent post={mockPost} isMobile={false} />);

      const prose = document.querySelector('.prose');
      expect(prose).toHaveClass('desktop-prose');
    });
  });

  describe('Image Responsiveness', () => {
    it('should render appropriately sized images for mobile', async () => {
      mockWindowSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height);
      const postWithImage = {
        ...mockBlogPosts[0],
        coverImage: '/images/test-cover.jpg'
      };
      
      render(<MockResponsivePostContent post={postWithImage} isMobile={true} />);

      const coverImage = screen.getByTestId('cover-image');
      expect(coverImage).toHaveClass('mobile-image');
    });

    it('should render high-resolution images for desktop', async () => {
      mockWindowSize(VIEWPORT_SIZES.desktop.width, VIEWPORT_SIZES.desktop.height);
      const postWithImage = {
        ...mockBlogPosts[0],
        coverImage: '/images/test-cover.jpg'
      };
      
      render(<MockResponsivePostContent post={postWithImage} isMobile={false} />);

      const coverImage = screen.getByTestId('cover-image');
      expect(coverImage).toHaveClass('desktop-image');
    });
  });

  describe('Performance on Different Devices', () => {
    it('should load efficiently on mobile devices', async () => {
      mockWindowSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height);
      
      const startTime = performance.now();
      render(<MockResponsiveBlogGrid posts={mockBlogPosts.slice(0, 5)} isMobile={true} />);
      const endTime = performance.now();
      
      // Should render quickly on mobile
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle large datasets efficiently on desktop', async () => {
      mockWindowSize(VIEWPORT_SIZES.desktop.width, VIEWPORT_SIZES.desktop.height);
      
      const largePosts = Array.from({ length: 50 }, (_, i) => ({
        ...mockBlogPosts[0],
        slug: `post-${i}`,
        title: `Post ${i}`
      }));
      
      const startTime = performance.now();
      render(<MockResponsiveBlogGrid posts={largePosts} columns="3" />);
      const endTime = performance.now();
      
      // Should handle large datasets efficiently
      expect(endTime - startTime).toBeLessThan(200);
    });
  });
});