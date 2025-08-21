import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { BlogPostSummary } from '@/types/blog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get all posts for related posts and navigation
    const allPosts = await getAllPosts();
    const currentIndex = allPosts.findIndex(p => p.slug === slug);

    // Get related posts (posts with similar tags, excluding current post)
    const relatedPosts = allPosts
      .filter(
        p => p.slug !== slug && p.tags.some(tag => post.tags.includes(tag))
      )
      .slice(0, 4);

    // Get previous and next posts
    const previousPost: BlogPostSummary | null =
      currentIndex > 0 ? allPosts[currentIndex - 1]! : null;
    const nextPost: BlogPostSummary | null =
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1]! : null;

    const postData = {
      post,
      relatedPosts,
      previousPost,
      nextPost,
    };

    return NextResponse.json(postData);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
