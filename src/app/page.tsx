import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Zap } from 'lucide-react';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';

// Optimized skeleton component for better performance
const PostCardSkeleton = () => (
  <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse'>
    <div className='h-48 bg-gray-200 dark:bg-gray-700'></div>
    <div className='p-6'>
      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2'></div>
      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4'></div>
      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
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

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': '#website',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        name: "Adrian's Personal Blog",
        description:
          'A modern personal blog featuring insights about web development, React, TypeScript, and building amazing user experiences.',
        publisher: {
          '@id': '#person',
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'Person',
        '@id': '#person',
        name: 'Adrian',
        description:
          'A passionate developer sharing insights about modern web development, React, TypeScript, and building amazing user experiences.',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        sameAs: [
          // Add social media URLs here when available
        ],
        jobTitle: 'Web Developer',
        knowsAbout: [
          'Web Development',
          'React',
          'TypeScript',
          'Next.js',
          'JavaScript',
        ],
      },
      {
        '@type': 'Blog',
        '@id': '#blog',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog`,
        name: "Adrian's Blog",
        description:
          'Latest thoughts on web development, best practices, and emerging technologies.',
        author: {
          '@id': '#person',
        },
        publisher: {
          '@id': '#person',
        },
        inLanguage: 'en-US',
      },
    ],
  };

  return (
    <>
      {/* Preload critical resources */}
      <link
        rel='preload'
        href='/fonts/inter-var.woff2'
        as='font'
        type='font/woff2'
        crossOrigin='anonymous'
      />
      <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossOrigin='anonymous'
      />

      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className='min-h-screen'>
        {/* Hero Section */}
        <section
          className='relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 sm:py-32'
          aria-labelledby='hero-heading'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center'>
              <h1
                id='hero-heading'
                className='text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6'
              >
                Hi, I&apos;m{' '}
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Adrian
                </span>
              </h1>
              <p className='text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto'>
                A passionate developer sharing insights about modern web
                development, React, TypeScript, and building amazing user
                experiences.
              </p>
              <div
                className='flex flex-col sm:flex-row gap-4 justify-center items-center'
                role='group'
                aria-label='Main navigation actions'
              >
                <Link
                  href='/blog'
                  className='inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 group'
                  aria-label='Read my blog posts'
                >
                  <BookOpen className='w-5 h-5 mr-2' />
                  Read My Blog
                  <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200' />
                </Link>
                <Link
                  href='/about'
                  className='inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-colors duration-200'
                  aria-label='Learn more about me'
                >
                  <Users className='w-5 h-5 mr-2' />
                  About Me
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section
          className='py-16 bg-white dark:bg-gray-900'
          aria-labelledby='recent-posts-heading'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2
                id='recent-posts-heading'
                className='text-3xl font-bold text-gray-900 dark:text-white mb-4'
              >
                Latest Posts
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                Discover insights, tutorials, and thoughts on modern web
                development
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

            <div className='text-center mt-12'>
              <Link
                href='/blog'
                className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-200'
                prefetch={false}
              >
                View All Posts
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </div>
          </div>
        </section>


      </main>
    </>
  );
}
