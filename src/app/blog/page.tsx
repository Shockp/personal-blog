import React from 'react';
import type { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { getAllPosts } from '@/lib/posts';
import BlogListingClient from '@/components/blog/BlogListingClient';

// SEO metadata for the blog listing page
export const metadata: Metadata = {
  title: 'Blog Posts | Personal Blog',
  description:
    'Discover insights, tutorials, and thoughts on web development, technology, and more.',
  keywords: [
    'blog',
    'web development',
    'technology',
    'programming',
    'tutorials',
  ],
  openGraph: {
    title: 'Blog Posts | Personal Blog',
    description:
      'Discover insights, tutorials, and thoughts on web development, technology, and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Posts | Personal Blog',
    description:
      'Discover insights, tutorials, and thoughts on web development, technology, and more.',
  },
};

// Server component that fetches data and renders client component
export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
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
  );
}
