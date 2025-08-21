import { Metadata } from 'next';
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
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { BlogPost, BlogPostSummary } from '@/types/blog';
import PostContent from '@/components/blog/PostContent';

interface PostPageProps {
  params: { slug: string };
}

interface PostPageData {
  post: BlogPost;
  relatedPosts: BlogPostSummary[];
  previousPost: BlogPostSummary | null;
  nextPost: BlogPostSummary | null;
}

/**
 * Generate static params for all blog posts
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const postUrl = `${baseUrl}/blog/${slug}`;
    const imageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`;

    return {
      title: `${post.title} | Personal Blog`,
      description: post.description,
      keywords: post.tags.join(', '),
      authors: [{ name: post.author }],
      creator: post.author,
      publisher: 'Personal Blog',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: post.description,
        url: postUrl,
        siteName: 'Personal Blog',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        locale: 'en_US',
        type: 'article',
        publishedTime: post.date,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [imageUrl],
        creator: '@yourusername', // Replace with actual Twitter handle
      },
      robots: {
        index: post.published,
        follow: post.published,
        googleBot: {
          index: post.published,
          follow: post.published,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch {
    return {
      title: 'Blog Post | Personal Blog',
      description: 'Read our latest blog post.',
    };
  }
}

/**
 * Get post data and related content
 */
async function getPostData(slug: string): Promise<PostPageData | null> {
  try {
    const [post, allPosts] = await Promise.all([
      getPostBySlug(slug),
      getAllPosts(),
    ]);

    if (!post) {
      return null;
    }

    // Find current post index for navigation
    const currentIndex = allPosts.findIndex(p => p.slug === slug);
    const previousPost =
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    // Find related posts based on shared tags
    const relatedPosts = allPosts
      .filter(p => p.slug !== slug && p.published)
      .filter(p => p.tags.some(tag => post.tags.includes(tag)))
      .sort((a, b) => {
        // Sort by number of shared tags
        const aSharedTags = a.tags.filter(tag =>
          post.tags.includes(tag)
        ).length;
        const bSharedTags = b.tags.filter(tag =>
          post.tags.includes(tag)
        ).length;
        return bSharedTags - aSharedTags;
      })
      .slice(0, 4);

    return {
      post,
      relatedPosts,
      previousPost,
      nextPost,
    };
  } catch {
    return null;
  }
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate reading time
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Individual Post Page Component
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const postData = await getPostData(slug);

  if (!postData) {
    notFound();
  }

  const { post, relatedPosts, previousPost, nextPost } = postData;
  const readingTime = calculateReadingTime(post.content);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const postUrl = `${baseUrl}/blog/slug`;

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
              className='inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer min-h-[44px] py-2'
            >
              <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
              Back to Blog
            </Link>
          </div>

          {/* Post Header */}
          <header className='mb-6 sm:mb-8'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight'>
              {post.title}
            </h1>

            <p className='text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed'>
              {post.description}
            </p>

            {/* Post Metadata */}
            <div className='flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
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
                <Tag className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0' />
                <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className='px-2 sm:px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer min-h-[24px] flex items-center'
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
                    <div className='flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2'>
                      <ArrowLeft className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                      Previous Post
                    </div>
                    <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight'>
                      {previousPost.title}
                    </h3>
                  </Link>
                )}

                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className='group p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer md:text-right min-h-[80px] flex flex-col justify-center'
                  >
                    <div className='flex items-center justify-start md:justify-end gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2'>
                      <span className='md:order-2'>Next Post</span>
                      <ArrowRight className='w-3.5 h-3.5 sm:w-4 sm:h-4 md:order-1' />
                    </div>
                    <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight text-left md:text-right'>
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
              <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6'>
                Related Posts
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className='group p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer min-h-[120px] flex flex-col'
                  >
                    <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-tight flex-shrink-0'>
                      {relatedPost.title}
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed flex-grow line-clamp-2'>
                      {relatedPost.description}
                    </p>
                    <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 flex-shrink-0'>
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
