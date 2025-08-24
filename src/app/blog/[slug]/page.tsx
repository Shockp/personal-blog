import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO';
import BlogPostStructuredData from '@/components/seo/BlogPostStructuredData';
import BreadcrumbStructuredData, {
  generateBlogBreadcrumbs,
} from '@/components/seo/BreadcrumbStructuredData';
import { PostPageClient } from './PostPageClient';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for the blog post page
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found | Personal Blog',
        description: 'The requested blog post could not be found.',
      };
    }

    const seoProps: Parameters<typeof generateSEOMetadata>[0] = {
      title: post.title,
      description: post.description,
      keywords: post.tags,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      tags: post.tags,
    };

    if (post.author) {
      seoProps.author = post.author;
    }

    if (post.image) {
      seoProps.image = post.image;
    }

    return generateSEOMetadata(seoProps);
  } catch (error) {
    console.error('Error generating metadata for post:', slug, error);
    return {
      title: 'Error | Personal Blog',
      description: 'An error occurred while loading the blog post.',
    };
  }
}

/**
 * Generate static params for static generation
 */
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map(post => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * Server Component for Blog Post Page
 * Handles SEO metadata generation and data fetching
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    // Generate breadcrumbs for the post
    const breadcrumbs = generateBlogBreadcrumbs(slug, post.title);
    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}/blog/${slug}`;

    return (
      <>
        {/* JSON-LD Structured Data */}
        <BlogPostStructuredData post={post} url={postUrl} />
        <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

        {/* Client Component for Interactive Features */}
        <PostPageClient post={post} slug={slug} />
      </>
    );
  } catch (error) {
    console.error('Error loading post:', slug, error);
    notFound();
  }
}
