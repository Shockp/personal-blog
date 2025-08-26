import React from 'react';
import { getAllPosts } from '@/lib/posts';
import BlogListingClient from '@/components/blog/BlogListingClient';
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO';
import BreadcrumbStructuredData from '@/components/seo/BreadcrumbStructuredData';

// SEO metadata for the blog listing page
export const metadata = generateSEOMetadata({
  title: 'Blog Posts',
  description:
    'Discover insights, tutorials, and thoughts on software engineering, scalable architecture, design patterns, and modern development practices from AFB Tech Blog.',
  keywords: [
    'afb tech blog',
    'blog',
    'software engineering',
    'scalable architecture',
    'design patterns',
    'clean code',
    'tutorials',
    'programming',
    'technology',
    'nextjs',
  ],
  type: 'website',
  url: '/blog',
});

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Server component that fetches data and renders client component
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getAllPosts();
  const params = await searchParams;
  const initialTag = typeof params.tag === 'string' ? params.tag : '';

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
              Discover insights, tutorials, and thoughts on software
              engineering, technology, and more.
            </p>
          </div>

          {/* Client component for interactive features */}
          <BlogListingClient posts={posts} initialTag={initialTag} />
        </div>
      </div>
    </>
  );
}
