/**
 * WebSite Structured Data Component
 * Renders JSON-LD structured data for the website
 */

import { generateWebSiteStructuredData } from '@/lib/structured-data';

interface WebSiteStructuredDataProps {
  className?: string;
}

export default function WebSiteStructuredData({ 
  className 
}: WebSiteStructuredDataProps = {}) {
  const structuredData = generateWebSiteStructuredData();

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
 * Hook to generate website structured data without rendering
 */
export function useWebSiteStructuredData() {
  return generateWebSiteStructuredData();
}