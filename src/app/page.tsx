import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO';
import WebSiteStructuredData from '@/components/seo/WebSiteStructuredData';
import AuthorStructuredData from '@/components/seo/AuthorStructuredData';

// SEO metadata for the home page
export const metadata = generateSEOMetadata({
  title: 'Home',
  description: 'Adrián Feito Blázquez - A passionate developer crafting digital experiences with modern technologies. Discover insights about web development, React, TypeScript, and building amazing user experiences.',
  keywords: ['adrián feito blázquez', 'web development', 'react', 'typescript', 'nextjs', 'javascript', 'frontend', 'developer', 'blog'],
  type: 'website',
  url: '/',
});

// Optimized skeleton component for better performance
const PostCardSkeleton = () => (
  <div
    className='rounded-lg shadow-md overflow-hidden animate-pulse'
    style={{ backgroundColor: 'var(--card-background)' }}
  >
    <div className='h-48' style={{ backgroundColor: 'var(--muted)' }}></div>
    <div className='p-6'>
      <div
        className='h-4 rounded mb-2'
        style={{ backgroundColor: 'var(--muted)' }}
      ></div>
      <div
        className='h-4 rounded w-3/4 mb-4'
        style={{ backgroundColor: 'var(--muted)' }}
      ></div>
      <div
        className='h-3 rounded w-1/2'
        style={{ backgroundColor: 'var(--muted)' }}
      ></div>
    </div>
  </div>
);

/**
 * Home Page Component
 *
 * The main landing page of the personal blog featuring:
 * - Hero section with personal introduction and call-to-action
 * - Recent posts preview section displaying the latest 3 blog posts
 * - Call-to-action sections for user engagement
 * - SEO optimization with structured data (JSON-LD)
 * - Responsive design for all device sizes
 * - Performance optimizations (preload hints, optimized loading states)
 * - Full theme system integration with dark mode support
 * - Accessibility features including ARIA labels and semantic HTML
 *
 * Performance targets:
 * - First Contentful Paint (FCP) < 1.5s
 * - Largest Contentful Paint (LCP) < 2.5s
 * - Cumulative Layout Shift (CLS) < 0.1
 *
 * @returns {JSX.Element} The complete home page with all sections
 */
export default async function Home() {
  // Fetch recent posts (limit to 3 for homepage)
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 3);

  return (
    <>
      {/* Preload critical resources */}
      <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossOrigin='anonymous'
      />

      {/* Structured Data */}
      <WebSiteStructuredData />
      <AuthorStructuredData />

      <main className='min-h-screen'>
        {/* Hero Section */}
        <section
          className='relative py-20 sm:py-32'
          style={{
            background: `linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-to))`,
          }}
          aria-labelledby='hero-heading'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center space-y-6 sm:space-y-8'>
              <div className='space-y-3 sm:space-y-4'>
                <h1
                  className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'
                  style={{ color: 'var(--foreground)' }}
                >
                  Hi, I&apos;m{' '}
                  <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Adrián Feito Blázquez
                  </span>
                </h1>
                <p
                  className='text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto px-4 sm:px-0'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  A passionate developer crafting digital experiences with
                  modern technologies
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0'>
                <Link
                  href='/blog'
                  className='w-full sm:w-auto group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-500 shadow-lg hover:shadow-xl min-h-[44px] text-base sm:text-lg'
                >
                  <BookOpen className='mr-2 h-5 w-5 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
                  <span className='group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500'>
                    Read My Blog
                  </span>
                </Link>
                <Link
                  href='/about'
                  className='w-full sm:w-auto group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-border hover:border-primary text-foreground hover:text-primary font-semibold rounded-lg transition-all duration-500 hover:shadow-lg min-h-[44px] text-base sm:text-lg'
                >
                  <Users className='mr-2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-500' />
                  <span className='transition-colors duration-500'>
                    About Me
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section
          className='py-12 sm:py-16 lg:py-20'
          style={{ backgroundColor: 'var(--muted)' }}
          aria-labelledby='recent-posts-heading'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-8 sm:mb-10 lg:mb-12'>
              <h2
                id='recent-posts-heading'
                className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4'
                style={{ color: 'var(--foreground)' }}
              >
                Recent Posts
              </h2>
              <p
                className='text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Discover my latest thoughts on web development, technology, and
                programming best practices.
              </p>
            </div>

            <Suspense
              fallback={
                <div
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  aria-label='Loading recent blog posts'
                >
                  {[...Array(3)].map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <div
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                role='list'
                aria-label='Recent blog posts'
              >
                {recentPosts.map(post => (
                  <div key={post.slug} role='listitem'>
                    <PostCard post={post} priority={true} />
                  </div>
                ))}
              </div>
            </Suspense>

            <div className='flex justify-center mt-8 sm:mt-10 lg:mt-12 px-4 sm:px-0'>
              <Link
                href='/blog'
                className='w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-500 group min-h-[44px] text-base sm:text-lg'
                prefetch={false}
              >
                <span className='group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500'>
                  View All Posts
                </span>
                <ArrowRight className='ml-2 h-4 w-4 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
