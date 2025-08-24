'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag } from 'lucide-react';
import PostContent from '@/components/blog/PostContent';
import PostCard from '@/components/blog/PostCard';
import { BlogPost, BlogPostSummary } from '@/types/blog';

interface PostData {
  post: BlogPost;
  relatedPosts: BlogPostSummary[];
  previousPost: BlogPostSummary | null;
  nextPost: BlogPostSummary | null;
}

interface PostPageClientProps {
  post: BlogPost;
  slug: string;
}

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
 * Client Component for Blog Post Page
 * Handles interactive features and UI rendering
 */
export function PostPageClient({ post, slug }: PostPageClientProps) {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostData() {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPostData(data);
        } else {
          setPostData({
            post,
            relatedPosts: [],
            previousPost: null,
            nextPost: null,
          });
        }
      } catch {
        setPostData({
          post,
          relatedPosts: [],
          previousPost: null,
          nextPost: null,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPostData();
  }, [slug, post]);

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div
            className='animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4'
            style={{ borderColor: 'var(--primary)' }}
          ></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!postData) {
    notFound();
  }

  const { post: currentPost, relatedPosts, previousPost, nextPost } = postData;
  const readingTime = calculateReadingTime(currentPost.content);

  return (
    <div className='min-h-screen bg-background'>
      <main className='container mx-auto px-4 py-8'>
        {/* Back to Blog Link */}
        <Link
          href='/blog'
          className='inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article className='max-w-4xl mx-auto'>
          <header className='mb-8'>
            <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>
              {currentPost.title}
            </h1>
            <p className='text-xl text-muted-foreground mb-6'>
              {currentPost.description}
            </p>

            {/* Post Meta */}
            <div className='flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6'>
              <div className='flex items-center gap-2'>
                <User className='w-4 h-4' />
                <span>{currentPost.author}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <time dateTime={currentPost.date}>
                  {formatDate(currentPost.date)}
                </time>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className='flex items-center gap-2 mb-8'>
                <Tag className='w-4 h-4 text-muted-foreground' />
                <div className='flex flex-wrap gap-2'>
                  {currentPost.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className='px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors'
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className='prose prose-lg max-w-none dark:prose-invert mb-12'>
            <PostContent content={currentPost.content} />
          </div>

          {/* Post Navigation */}
          {(previousPost || nextPost) && (
            <nav className='border-t border-border pt-8 mb-12'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {previousPost && (
                  <Link
                    href={`/blog/${previousPost.slug}`}
                    className='group p-6 border border-border rounded-lg hover:border-primary/50 transition-colors'
                  >
                    <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                      <ArrowLeft className='w-4 h-4' />
                      Previous Post
                    </div>
                    <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                      {previousPost.title}
                    </h3>
                  </Link>
                )}
                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className='group p-6 border border-border rounded-lg hover:border-primary/50 transition-colors md:text-right'
                  >
                    <div className='flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2'>
                      Next Post
                      <ArrowRight className='w-4 h-4' />
                    </div>
                    <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                      {nextPost.title}
                    </h3>
                  </Link>
                )}
              </div>
            </nav>
          )}

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section className='border-t border-border pt-12'>
              <h2 className='text-2xl font-bold text-foreground mb-8'>
                Related Posts
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {relatedPosts.slice(0, 3).map((relatedPost) => (
                  <PostCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </div>
  );
}