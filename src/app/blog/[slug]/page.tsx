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
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
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
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Back to Blog Link */}
          <div className='mb-8'>
            <Link
              href='/blog'
              className='inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Blog
            </Link>
          </div>

          {/* Post Header */}
          <header className='mb-8'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight'>
              {post.title}
            </h1>

            <p className='text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed'>
              {post.description}
            </p>

            {/* Post Metadata */}
            <div className='flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400'>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>

              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                <span>{readingTime} min read</span>
              </div>

              <div className='flex items-center gap-2'>
                <User className='w-4 h-4' />
                <span>{post.author}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className='flex items-center gap-2 mt-4'>
                <Tag className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                <div className='flex flex-wrap gap-2'>
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className='px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </header>



          {/* Post Content */}
          <div className='mb-12'>
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
            <nav className='border-t border-gray-200 dark:border-gray-700 pt-8 mb-12'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {previousPost && (
                  <Link
                    href={`/blog/${previousPost.slug}`}
                    className='group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer'
                  >
                    <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2'>
                      <ArrowLeft className='w-4 h-4' />
                      Previous Post
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {previousPost.title}
                    </h3>
                  </Link>
                )}

                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className='group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer md:text-right'
                  >
                    <div className='flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2'>
                      Next Post
                      <ArrowRight className='w-4 h-4' />
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {nextPost.title}
                    </h3>
                  </Link>
                )}
              </div>
            </nav>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className='border-t border-gray-200 dark:border-gray-700 pt-8'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Related Posts
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className='group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer'
                  >
                    <h3 className='font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2'>
                      {relatedPost.title}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300 mb-3'>
                      {relatedPost.description}
                    </p>
                    <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
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