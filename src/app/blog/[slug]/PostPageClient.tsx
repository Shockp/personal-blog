'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Tag,
} from '@/components/ui/icons';
import { BlogPost, BlogPostSummary } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import PostContent from '@/components/blog/PostContent';

interface PostPageClientProps {
  post: BlogPost;
  relatedPosts: BlogPostSummary[];
  previousPost: BlogPostSummary | null;
  nextPost: BlogPostSummary | null;
}

export function PostPageClient({
  post,
  relatedPosts,
  previousPost,
  nextPost,
}: PostPageClientProps) {
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
              {post.title}
            </h1>
            <p className='text-xl text-muted-foreground mb-6'>
              {post.description}
            </p>

            {/* Post Meta */}
            <div className='flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6'>
              <div className='flex items-center gap-2'>
                <User className='w-4 h-4' />
                <span>{post.author}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className='flex items-center gap-2 mb-8'>
                <Tag className='w-4 h-4 text-muted-foreground' />
                <div className='flex flex-wrap gap-2'>
                  {post.tags.map(tag => (
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
          <div className='mb-12'>
            <PostContent content={post.content} title={post.title} />
          </div>

          {/* Navigation */}
          {(previousPost || nextPost) && (
            <>
              <hr className='my-12 border-border' />
              <nav
                className='flex justify-between items-center'
                aria-label='Post navigation'
              >
                <div className='flex-1'>
                  {previousPost && (
                    <Link
                      href={`/blog/${previousPost.slug}`}
                      className='group flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors'
                    >
                      <ArrowLeft className='h-4 w-4' />
                      <div className='text-left'>
                        <div className='text-sm'>Previous</div>
                        <div className='font-medium group-hover:underline'>
                          {previousPost.title}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
                <div className='flex-1 text-right'>
                  {nextPost && (
                    <Link
                      href={`/blog/${nextPost.slug}`}
                      className='group flex items-center justify-end space-x-2 text-muted-foreground hover:text-foreground transition-colors'
                    >
                      <div className='text-right'>
                        <div className='text-sm'>Next</div>
                        <div className='font-medium group-hover:underline'>
                          {nextPost.title}
                        </div>
                      </div>
                      <ArrowRight className='h-4 w-4' />
                    </Link>
                  )}
                </div>
              </nav>
            </>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <>
              <hr className='my-12 border-border' />
              <section aria-labelledby='related-posts-heading'>
                <h2
                  id='related-posts-heading'
                  className='text-2xl font-bold mb-6'
                >
                  Related Posts
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {relatedPosts.map(relatedPost => (
                    <div
                      key={relatedPost.slug}
                      className='border border-border rounded-lg p-6 hover:shadow-md transition-shadow bg-card'
                    >
                      <div className='pb-3'>
                        <h3 className='text-lg leading-tight font-semibold'>
                          <Link
                            href={`/blog/${relatedPost.slug}`}
                            className='hover:text-primary transition-colors'
                          >
                            {relatedPost.title}
                          </Link>
                        </h3>
                      </div>
                      <div className='pt-0'>
                        <p className='text-muted-foreground text-sm mb-3 line-clamp-2'>
                          {relatedPost.description}
                        </p>
                        <div className='flex items-center text-xs text-muted-foreground space-x-4'>
                          <div className='flex items-center space-x-1'>
                            <Calendar className='h-3 w-3' />
                            <span>{formatDate(relatedPost.date)}</span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <Clock className='h-3 w-3' />
                            <span>{relatedPost.readingTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </article>
      </main>
    </div>
  );
}
