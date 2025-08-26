'use client';

import { Mail, MapPin, Globe } from '@/components/ui/icons';
import { useState } from 'react';

type IconName = 'mail' | 'mapPin' | 'globe';

interface ContactCardProps {
  iconName: IconName;
  title: string;
  description: string;
  content: string;
  href?: string;
  iconBgColor: string;
  iconColor: string;
  isLink?: boolean;
  children?: React.ReactNode;
}

const iconMap = {
  mail: Mail,
  mapPin: MapPin,
  globe: Globe,
};

/**
 * Interactive Contact Card Component
 *
 * A client component that handles hover interactions for contact information cards.
 * Supports both link and non-link variants with smooth color transitions.
 */
export default function ContactCard({
  iconName,
  title,
  description,
  content,
  href,
  iconBgColor,
  iconColor,
  isLink = false,
  children,
}: ContactCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[iconName];

  const cardContent = (
    <div
      className='group relative rounded-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 h-full flex flex-col p-6 text-center'
      style={{
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--card-border)',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: 'var(--card-shadow)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--card-hover-shadow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--card-shadow)';
      }}
    >
      <div
        className={`${iconBgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
      >
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h3
        className='text-lg font-semibold mb-2'
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <p className='mb-4' style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {isLink && href ? (
        <a
          href={href}
          className='font-medium transition-colors duration-500'
          style={{
            color: isHovered ? 'var(--text-primary)' : 'var(--text-accent)',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {content}
        </a>
      ) : (
        <p className='font-medium' style={{ color: 'var(--text-primary)' }}>
          {content}
        </p>
      )}
      {children}
    </div>
  );

  return cardContent;
}
