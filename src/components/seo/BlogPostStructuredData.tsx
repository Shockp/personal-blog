/**
 * BlogPost Structured Data Component
 * Renders JSON-LD structured data for blog posts
 */

import { BlogPost } from '@/types/blog';
import { generateBlogPostStructuredData } from '@/lib/structured-data';

interface BlogPostStructuredDataProps {
  post: BlogPost;
  url: string;
}

export default function BlogPostStructuredData({
  post,
  url,
}: BlogPostStructuredDataProps) {
  const structuredData = generateBlogPostStructuredData(post, url);

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

/**
 * Hook to generate blog post structured data without rendering
 */
export function useBlogPostStructuredData(post: BlogPost, url: string) {
  return generateBlogPostStructuredData(post, url);
}
