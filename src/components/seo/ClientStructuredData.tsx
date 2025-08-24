'use client';

import { useEffect, useState } from 'react';
import { generateWebSiteStructuredData, generateAuthorStructuredData } from '@/lib/structured-data';

interface ClientStructuredDataProps {
  type: 'website' | 'author';
  nonce?: string;
  className?: string;
}

export default function ClientStructuredData({
  type,
  nonce,
  className,
}: ClientStructuredDataProps) {
  const [clientNonce, setClientNonce] = useState(nonce || '');

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && !clientNonce) {
      const metaTag = document.querySelector('meta[name="csp-nonce"]');
      if (metaTag) {
        const nonceValue = metaTag.getAttribute('content') || '';
        setClientNonce(nonceValue);
      }
    }
  }, [clientNonce]);

  const structuredData = type === 'website' 
    ? generateWebSiteStructuredData()
    : generateAuthorStructuredData();

  return (
    <script
      type='application/ld+json'
      className={className}
      nonce={clientNonce}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}