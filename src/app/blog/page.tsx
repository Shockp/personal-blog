import React from 'react';
import { getAllPosts } from '@/lib/posts';
import BlogListingClient from '@/components/blog/BlogListingClient';
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO';
import BreadcrumbStructuredData from '@/components/seo/BreadcrumbStructuredData';

// SEO metadata for the blog listing page
export const metadata = generateSEOMetadata({
  title: 'Blog Posts',
  description:
    'Discover insights, tutorials, and thoughts on web development, React, TypeScript, and modern technologies by Adrián Feito Blázquez. Stay updated with the latest trends and best practices.',
  keywords: [
    'adrián feito blázquez',
    'blog',
    'web development',
    'react',
    'typescript',
    'javascript',
    'tutorials',
    'programming',
    'technology',
    'nextjs',
  ],
  type: 'website',
  url: '/blog',
});

// Server component that fetches data and renders client component
export default async function BlogPage() {
  const posts = await getAllPosts();

  // Generate breadcrumbs for the blog page
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ];

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className='min-h-screen bg-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-foreground mb-4'>
              Blog Posts
            </h1>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Discover insights, tutorials, and thoughts on web development,
              technology, and more.
            </p>
          </div>

          {/* Client component for interactive features */}
          <BlogListingClient posts={posts} />
        </div>
      </div>
    </>
  );
}
