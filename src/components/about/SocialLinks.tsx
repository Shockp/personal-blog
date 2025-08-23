'use client';

import { useState } from 'react';

interface SocialLink {
  href: string;
  label: string;
  ariaLabel: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

/**
 * Interactive Social Links Component
 * 
 * A client component that handles hover interactions for social media links.
 * Provides smooth color transitions on hover.
 */
export default function SocialLinks({ links }: SocialLinksProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className='flex justify-center space-x-4'>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className='transition-colors duration-500'
          style={{
            color: hoveredIndex === index ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-label={link.ariaLabel}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}