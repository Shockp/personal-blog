/**
 * Author Structured Data Component
 * Renders JSON-LD structured data for the author (Adrián Feito Blázquez)
 */

import { generateAuthorStructuredData } from '@/lib/structured-data';

interface AuthorStructuredDataProps {
  className?: string;
}

export default function AuthorStructuredData({ 
  className 
}: AuthorStructuredDataProps = {}) {
  const structuredData = generateAuthorStructuredData();

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
 * Hook to generate author structured data without rendering
 */
export function useAuthorStructuredData() {
  return generateAuthorStructuredData();
}