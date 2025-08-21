'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Tag,
} from 'lucide-react';

import { BlogPost, BlogPostSummary } from '@/types/blog';
import PostContent from '@/components/blog/PostContent';
import { useEffect, useState } from 'react';

interface PostPageProps {
  params: {
    slug: string;
  };
}

interface PostData {
  post: BlogPost;
  relatedPosts: BlogPostSummary[];
  previousPost: BlogPostSummary | null;
  nextPost: BlogPostSummary | null;
}

/**
 * Get post data with related posts and navigation
 */

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate reading time based on content
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Individual Post Page Component
 */
export default function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostData() {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPostData(data);
          // Set document metadata
          document.title = `${data.title} | Personal Blog`;
          const metaDescription = document.querySelector(
            'meta[name="description"]'
          );
          if (metaDescription) {
            metaDescription.setAttribute('content', data.description);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = data.description;
            document.head.appendChild(meta);
          }
        } else {
          setPostData(null);
        }
      } catch {
        setPostData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPostData();
  }, [slug]);

  if (loading) {
    return (
      <div className='min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!postData) {
    notFound();
  }

  const { post, relatedPosts, previousPost, nextPost } = postData;
  const readingTime = calculateReadingTime(post.content);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const postUrl = `${baseUrl}/blog/${slug}`;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: undefined,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Personal Blog',
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.tags.join(', '),
    articleSection: 'Blog',
    inLanguage: 'en-US',
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='min-h-screen bg-white dark:bg-gray-900'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
          {/* Back to Blog Link */}
          <div className='mb-6 sm:mb-8'>
            <Link
              href='/blog'
              className='inline-flex items-center gap-2 text-sm sm:text-base transition-colors cursor-pointer min-h-[44px] py-2'
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = 'var(--text-primary)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = 'var(--text-secondary)')
              }
            >
              <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
              Back to Blog
            </Link>
          </div>

          {/* Post Header */}
          <header className='mb-6 sm:mb-8'>
            <h1
              className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight'
              style={{ color: 'var(--text-primary)' }}
            >
              {post.title}
            </h1>

            <p
              className='text-base sm:text-lg md:text-xl mb-4 sm:mb-6 leading-relaxed'
              style={{ color: 'var(--text-secondary)' }}
            >
              {post.description}
            </p>

            {/* Post Metadata */}
            <div
              className='flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm'
              style={{ color: 'var(--text-muted)' }}
            >
              <div className='flex items-center gap-1.5 sm:gap-2'>
                <Calendar className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>

              <div className='flex items-center gap-1.5 sm:gap-2'>
                <Clock className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                <span>{readingTime} min read</span>
              </div>

              <div className='flex items-center gap-1.5 sm:gap-2'>
                <User className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                <span>{post.author}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className='flex items-start gap-2 mt-3 sm:mt-4'>
                <Tag
                  className='w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 flex-shrink-0'
                  style={{ color: 'var(--text-muted)' }}
                />
                <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className='px-2 sm:px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer min-h-[24px] flex items-center'
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className='mb-8 sm:mb-10 lg:mb-12'>
            <PostContent
              content={post.content}
              title={post.title}
              url={postUrl}
              showToc={true}
              showSocialShare={true}
            />
          </div>

          {/* Post Navigation */}
          {(previousPost || nextPost) && (
            <nav className='border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 mb-8 sm:mb-10 lg:mb-12'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                {previousPost && (
                  <Link
                    href={`/blog/${previousPost.slug}`}
                    className='group p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer min-h-[80px] flex flex-col justify-center'
                  >
                    <div
                      className='flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-1.5 sm:mb-2'
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ArrowLeft className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                      Previous Post
                    </div>
                    <h3
                      className='text-sm sm:text-base font-semibold transition-colors leading-tight'
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {previousPost.title}
                    </h3>
                  </Link>
                )}

                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className='group p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer md:text-right min-h-[80px] flex flex-col justify-center'
                  >
                    <div
                      className='flex items-center justify-start md:justify-end gap-1.5 sm:gap-2 text-xs sm:text-sm mb-1.5 sm:mb-2'
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span className='md:order-2'>Next Post</span>
                      <ArrowRight className='w-3.5 h-3.5 sm:w-4 sm:h-4 md:order-1' />
                    </div>
                    <h3
                      className='text-sm sm:text-base font-semibold transition-colors leading-tight text-left md:text-right'
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {nextPost.title}
                    </h3>
                  </Link>
                )}
              </div>
            </nav>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className='border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8'>
              <h2
                className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6'
                style={{ color: 'var(--text-primary)' }}
              >
                Related Posts
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className='group p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer min-h-[120px] flex flex-col'
                  >
                    <h3
                      className='text-sm sm:text-base font-semibold transition-colors mb-2 leading-tight flex-shrink-0'
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {relatedPost.title}
                    </h3>
                    <p
                      className='text-xs sm:text-sm mb-3 leading-relaxed flex-grow line-clamp-2'
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {relatedPost.description}
                    </p>
                    <div
                      className='flex items-center justify-between text-xs flex-shrink-0'
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span>{formatDate(relatedPost.date)}</span>
                      <span>{relatedPost.readingTime} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
