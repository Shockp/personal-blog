// SEO and structured data components
// SEO components
// Provides SEO optimization and structured data components

export { default as AuthorStructuredData } from './AuthorStructuredData';
export { default as BlogPostStructuredData } from './BlogPostStructuredData';
export { default as BreadcrumbStructuredData } from './BreadcrumbStructuredData';
export { default as ClientStructuredData } from './ClientStructuredData';
export { default as OrganizationStructuredData } from './OrganizationStructuredData';
export { generateMetadata } from './SEO';
export { default as WebSiteStructuredData } from './WebSiteStructuredData';

// Re-export types
export type { SEOProps } from './SEO';
