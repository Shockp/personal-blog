/**
 * Organization Structured Data Component
 * Renders JSON-LD structured data for organization (None in this case)
 */

import { generateOrganizationStructuredData } from '@/lib/structured-data';

interface OrganizationStructuredDataProps {
  className?: string;
}

export default function OrganizationStructuredData({ 
  className 
}: OrganizationStructuredDataProps = {}) {
  const structuredData = generateOrganizationStructuredData();

  // Return null if no organization data (organization is "None")
  if (!structuredData) {
    return null;
  }

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
 * Hook to generate organization structured data without rendering
 */
export function useOrganizationStructuredData() {
  return generateOrganizationStructuredData();
}