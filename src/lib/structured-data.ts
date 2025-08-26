/**
 * Utility functions for generating JSON-LD structured data
 */

import {
  Person,
  Organization,
  BreadcrumbList,
  ListItem,
  StructuredData,
} from '@/types/structured-data';
import { BlogPost, BlogPostSummary } from '@/types/blog';

// Author information
export const AUTHOR_INFO: Person = {
  '@type': 'Person',
  name: 'AFB Tech Blog',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
  image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}/images/author.jpg`,
  sameAs: [
    // Add social media URLs here if available
  ],
  jobTitle: 'Tech Blog Author',
};

// Organization information (None as specified)
export const ORGANIZATION_INFO: Organization | null = null;

/**
 * Generate JSON-LD for a blog post
 */
export function generateBlogPostStructuredData(
  post: BlogPost | BlogPostSummary,
  url: string
): StructuredData {
  const blogPosting: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    ...(post.image && {
      image: [
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}${post.image}`,
      ],
    }),
    datePublished: post.date,
    dateModified: post.date, // Use date as modified date since updatedAt doesn't exist
    author: AUTHOR_INFO,
    ...(ORGANIZATION_INFO && { publisher: ORGANIZATION_INFO }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    ...('wordCount' in post && post.wordCount && { wordCount: post.wordCount }),
    ...(post.tags &&
      post.tags.length > 0 && {
        keywords: post.tags,
        articleSection: post.tags[0],
      }),
  };

  return blogPosting;
}

/**
 * Generate JSON-LD for author information
 */
export function generateAuthorStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    ...AUTHOR_INFO,
  };
}

/**
 * Generate JSON-LD for organization (returns null since organization is "None")
 */
export function generateOrganizationStructuredData(): StructuredData | null {
  if (!ORGANIZATION_INFO) return null;

  return {
    '@context': 'https://schema.org',
    ...ORGANIZATION_INFO,
  };
}

/**
 * Generate JSON-LD for breadcrumb navigation
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
): StructuredData {
  const itemListElement: ListItem[] = breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  }));

  const breadcrumbList: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement,
  };

  return {
    '@context': 'https://schema.org',
    ...breadcrumbList,
  };
}

/**
 * Generate structured data for the website
 */
export function generateWebSiteStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AFB Tech Blog',
    description:
      'AFB Tech Blog: Insights on software engineering, scalable architecture, design patterns, and modern development practices.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
    author: AUTHOR_INFO,
    publisher: ORGANIZATION_INFO || undefined,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate multiple structured data objects
 */
export function generateMultipleStructuredData(
  ...structuredDataObjects: (StructuredData | null)[]
): StructuredData[] {
  return structuredDataObjects.filter(
    (data): data is StructuredData => data !== null
  );
}
