'use client';

import { useState, useEffect } from 'react';

interface SocialLink {
  href: string;
  label: string;
  ariaLabel: string;
}

// SVG Icon components for social media platforms
const GitHubIcon = () => (
  <svg
    className='h-6 w-6'
    fill='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path
      fillRule='evenodd'
      d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
      clipRule='evenodd'
    ></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg
    className='h-6 w-6'
    fill='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path
      fillRule='evenodd'
      d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
      clipRule='evenodd'
    ></path>
  </svg>
);

const HackTheBoxIcon = () => (
  <svg
    className='h-6 w-6'
    fill='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path d='M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.073 1.445L12 1.031l1.073.414 9.319 3.597v1.958l-9.319 3.597L12 10.969l-1.073-.372L1.608 6.999V5.042l9.319-3.597zM12 2.832L3.756 6L12 9.168 20.244 6 12 2.832zm-8.392 4.01v8.316L12 18.755l8.392-3.597V6.842L12 10.439 3.608 6.842z' />
  </svg>
);

const LeetCodeIcon = () => (
  <svg
    className='h-6 w-6'
    fill='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path d='M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.518 2.524 8.117.96 2.04-1.226 3.333-3.294 3.333-5.54v-1.775a.983.983 0 0 1 .983-.982h2.35a.94.94 0 0 0 .94-.939c0-.261-.108-.522-.291-.704L14.692.740a1.388 1.388 0 0 0-.982-.438 1.388 1.388 0 0 0-.227-.004zM2.786 16.202l3.665 3.592a1.07 1.07 0 0 0 1.516 0l9.32-9.13a1.07 1.07 0 0 0 0-1.516L13.622 5.55a1.07 1.07 0 0 0-1.516 0l-9.32 9.132a1.07 1.07 0 0 0 0 1.516v.004z' />
  </svg>
);

// Icon mapping for social media platforms
const getIconComponent = (label: string) => {
  switch (label.toLowerCase()) {
    case 'github':
      return GitHubIcon;
    case 'linkedin':
      return LinkedInIcon;
    case 'hackthebox':
    case 'htb':
      return HackTheBoxIcon;
    case 'leetcode':
      return LeetCodeIcon;
    default:
      return null;
  }
};

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className='flex justify-center space-x-4'>
      {links.map((link, index) => {
        const IconComponent = getIconComponent(link.label);
        return (
          <a
            key={`${link.label}-${index}`}
            href={link.href}
            className='transition-colors duration-500'
            style={{
              color:
                isClient && hoveredIndex === index
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
            }}
            onMouseEnter={() => isClient && setHoveredIndex(index)}
            onMouseLeave={() => isClient && setHoveredIndex(null)}
            aria-label={link.ariaLabel}
          >
            {IconComponent ? <IconComponent /> : link.label}
          </a>
        );
      })}
    </div>
  );
}
