/**
 * Breadcrumb Structured Data Component
 * Renders JSON-LD structured data for breadcrumb navigation
 */

import { generateBreadcrumbStructuredData } from '@/lib/structured-data';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

export default function BreadcrumbStructuredData({ 
  breadcrumbs,
  className 
}: BreadcrumbStructuredDataProps) {
  // Don't render if no breadcrumbs or only one item (home)
  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }

  const structuredData = generateBreadcrumbStructuredData(breadcrumbs);

  return (
    <script
      type="application/ld+json"
      className={className}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

/**
 * Hook to generate breadcrumb structured data without rendering
 */
export function useBreadcrumbStructuredData(breadcrumbs: BreadcrumbItem[]) {
  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }
  return generateBreadcrumbStructuredData(breadcrumbs);
}

/**
 * Utility function to generate common breadcrumb paths
 */
export function generateBlogBreadcrumbs(slug?: string, title?: string): BreadcrumbItem[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: baseUrl },
    { name: 'Blog', url: `${baseUrl}/blog` }
  ];

  if (slug && title) {
    breadcrumbs.push({
      name: title,
      url: `${baseUrl}/blog/${slug}`
    });
  }

  return breadcrumbs;
}

export function generateAboutBreadcrumbs(): BreadcrumbItem[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  return [
    { name: 'Home', url: baseUrl },
    { name: 'About', url: `${baseUrl}/about` }
  ];
}