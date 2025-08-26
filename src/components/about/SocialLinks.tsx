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
    <path d='M11.996 0L1.61 6v12l10.386 6L22.39 18V6L11.996 0zM6.676 10.12l5.32-3.072 5.32 3.072v6.144l-5.32 3.072-5.32-3.072V10.12zm1.771 5.089l3.549 2.05 3.549-2.05v-4.1l-3.549-2.05-3.549 2.05v4.1z' />
  </svg>
);

const LeetCodeIcon = () => (
  <svg
    className='h-6 w-6'
    fill='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path d='M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z' />
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
