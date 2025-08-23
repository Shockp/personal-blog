'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import LazyMarkdownRenderer from './LazyMarkdownRenderer';
import LazySocialShare from './LazySocialShare';

/**
 * Represents a table of contents item
 */
interface TocItem {
  /** The heading text */
  text: string;
  /** The heading level (1-6) */
  level: number;
  /** The anchor ID for navigation */
  id: string;
}

/**
 * Props for the PostContent component
 */
interface PostContentProps {
  /** The markdown content to render */
  content: string;
  /** The post title for social sharing */
  title?: string;
  /** The post URL for social sharing */
  url?: string;
  /** Whether to show the table of contents */
  showToc?: boolean;
  /** Whether to show social sharing buttons */
  showSocialShare?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PostContent Component
 *
 * A comprehensive component for rendering markdown content with advanced features:
 * - Markdown rendering with syntax highlighting
 * - Table of contents generation
 * - Social sharing buttons
 * - HTML sanitization for security
 * - Responsive design with theme support
 * - Accessibility features
 *
 * @param props - The component props
 * @returns The rendered PostContent component
 */
export default function PostContent({
  content,
  title = 'Blog Post',
  url = typeof window !== 'undefined' ? window.location.href : '',
  showToc = true,
  showSocialShare = true,
  className = '',
}: PostContentProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Sanitize the markdown content
  const sanitizedContent = useMemo(() => {
    if (typeof window === 'undefined') return content;
    return DOMPurify.sanitize(content);
  }, [content]);

  // Generate table of contents from markdown headings
  useEffect(() => {
    const headings = content.match(/^#{1,6}\s+.+$/gm);
    if (headings) {
      const items: TocItem[] = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 1;
        const text = heading.replace(/^#+\s+/, '').trim();
        const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        return { text, level, id };
      });
      setTocItems(items);
    }
  }, [content]);

  // Handle intersection observer for active heading
  useEffect(() => {
    if (typeof window === 'undefined' || tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    // Observe all headings after a short delay to ensure they're rendered
    const timer = setTimeout(() => {
      tocItems.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [tocItems]);

  // Custom components for markdown rendering
  const components = {
    h1: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
      children?: React.ReactNode;
    }) => {
      const text = children?.toString() || '';
      const id =
        tocItems.find(item => item.text === text && item.level === 1)?.id || '';
      return (
        <h1
          id={id}
          className='text-4xl font-bold mb-6 text-foreground'
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
      children?: React.ReactNode;
    }) => {
      const text = children?.toString() || '';
      const id =
        tocItems.find(item => item.text === text && item.level === 2)?.id || '';
      return (
        <h2
          id={id}
          className='text-3xl font-semibold mb-4 mt-8 text-foreground'
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
      children?: React.ReactNode;
    }) => {
      const text = children?.toString() || '';
      const id =
        tocItems.find(item => item.text === text && item.level === 3)?.id || '';
      return (
        <h3
          id={id}
          className='text-2xl font-semibold mb-3 mt-6 text-foreground'
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
      children?: React.ReactNode;
    }) => {
      const text = children?.toString() || '';
      const id =
        tocItems.find(item => item.text === text && item.level === 4)?.id || '';
      return (
        <h4
          id={id}
          className='text-xl font-semibold mb-2 mt-5 text-foreground'
          {...props}
        >
          {children}
        </h4>
      );
    },
    h5: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
      children?: React.ReactNode;
    }) => {
      const text = children?.toString() || '';
      const id =
        tocItems.find(item => item.text === text && item.level === 5)?.id || '';
      return (
        <h5
          id={id}
          className='text-lg font-semibold mb-2 mt-4 text-foreground'
          {...props}
        >
          {children}
        </h5>
      );
    },
    h6: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
      children?: React.ReactNode;
    }) => {
      const text = children?.toString() || '';
      const id =
        tocItems.find(item => item.text === text && item.level === 6)?.id || '';
      return (
        <h6
          id={id}
          className='text-base font-semibold mb-2 mt-3 text-foreground'
          {...props}
        >
          {children}
        </h6>
      );
    },
    p: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement> & {
      children?: React.ReactNode;
    }) => (
      <p className='mb-4 text-muted-foreground leading-relaxed' {...props}>
        {children}
      </p>
    ),
    a: ({
      href,
      children,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      children?: React.ReactNode;
    }) => {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          className='text-blue-600 hover:text-blue-800 underline transition-colors'
          {...(isExternal && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
          {...props}
        >
          {children}
        </a>
      );
    },
    ul: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLUListElement> & {
      children?: React.ReactNode;
    }) => (
      <ul className='mb-4 ml-6 list-disc text-muted-foreground' {...props}>
        {children}
      </ul>
    ),
    ol: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLOListElement> & {
      children?: React.ReactNode;
    }) => (
      <ol className='mb-4 ml-6 list-decimal text-muted-foreground' {...props}>
        {children}
      </ol>
    ),
    li: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLLIElement> & {
      children?: React.ReactNode;
    }) => (
      <li className='mb-1' {...props}>
        {children}
      </li>
    ),
    blockquote: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLQuoteElement> & {
      children?: React.ReactNode;
    }) => (
      <blockquote
        className='border-l-4 border-border pl-4 my-4 italic text-muted-foreground'
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({
      inline,
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement> & {
      inline?: boolean;
      children?: React.ReactNode;
    }) => {
      if (inline) {
        return (
          <code
            className='bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground'
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code className='block' {...props}>
          {children}
        </code>
      );
    },
    pre: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLPreElement> & {
      children?: React.ReactNode;
    }) => (
      <pre
        className='bg-muted/50 p-4 rounded-lg overflow-x-auto mb-4 border border-border'
        {...props}
      >
        {children}
      </pre>
    ),
    img: ({ src, alt, title }: React.ImgHTMLAttributes<HTMLImageElement>) => {
      if (!src) return null;

      // Ensure src is a string for Next.js Image component
      const imageSrc = typeof src === 'string' ? src : '';

      return (
        <div className='relative my-6 overflow-hidden rounded-lg border border-border'>
          <Image
            src={imageSrc}
            alt={alt || 'Blog post image'}
            width={800 as number}
            height={400 as number}
            className='object-cover transition-transform duration-300 hover:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px'
            placeholder='blur'
            blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
          />
          {title && (
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4'>
              <p className='text-white text-sm font-medium'>{title}</p>
            </div>
          )}
        </div>
      );
    },
  };

  return (
    <div className={`max-w-none ${className}`}>
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Table of Contents */}
        {showToc && tocItems.length > 0 && (
          <aside className='lg:w-64 lg:flex-shrink-0'>
            <div className='sticky top-8'>
              <h3 className='text-lg font-semibold mb-4 text-foreground'>
                Table of Contents
              </h3>
              <nav className='space-y-1' aria-label='Table of contents'>
                {tocItems.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-1 text-sm transition-colors hover:text-blue-600 ${
                      activeHeading === item.id
                        ? 'text-blue-600 font-medium'
                        : 'text-muted-foreground'
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                    onClick={e => {
                      e.preventDefault();
                      const element = document.getElementById(item.id);
                      if (element) {
                        element.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className='flex-1 min-w-0'>
          <LazyMarkdownRenderer
            content={content}
            components={components}
            sanitizedContent={sanitizedContent}
          />

          {/* Social Sharing */}
          {showSocialShare && <LazySocialShare title={title} url={url} />}
        </main>
      </div>
    </div>
  );
}
