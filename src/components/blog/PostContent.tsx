'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { Share, Twitter, Linkedin, Facebook, Copy, Check } from 'lucide-react';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

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
  const [copySuccess, setCopySuccess] = useState<string>('');

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

  // Social sharing functions
  const shareOnTwitter = () => {
    const text = `Check out this article: ${title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess('copied');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      setCopySuccess('error');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

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
          className='text-4xl font-bold mb-6 text-gray-900 dark:text-white'
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
          className='text-3xl font-semibold mb-4 mt-8 text-gray-900 dark:text-white'
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
          className='text-2xl font-semibold mb-3 mt-6 text-gray-900 dark:text-white'
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
          className='text-xl font-semibold mb-2 mt-5 text-gray-900 dark:text-white'
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
          className='text-lg font-semibold mb-2 mt-4 text-gray-900 dark:text-white'
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
          className='text-base font-semibold mb-2 mt-3 text-gray-900 dark:text-white'
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
      <p
        className='mb-4 text-gray-700 dark:text-gray-300 leading-relaxed'
        {...props}
      >
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
          className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors'
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
      <ul
        className='mb-4 ml-6 list-disc text-gray-700 dark:text-gray-300'
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLOListElement> & {
      children?: React.ReactNode;
    }) => (
      <ol
        className='mb-4 ml-6 list-decimal text-gray-700 dark:text-gray-300'
        {...props}
      >
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
        className='border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400'
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
            className='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200'
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
        className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-200 dark:border-gray-700'
        {...props}
      >
        {children}
      </pre>
    ),
  };

  return (
    <div className={`max-w-none ${className}`}>
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Table of Contents */}
        {showToc && tocItems.length > 0 && (
          <aside className='lg:w-64 lg:flex-shrink-0'>
            <div className='sticky top-8'>
              <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                Table of Contents
              </h3>
              <nav className='space-y-1' aria-label='Table of contents'>
                {tocItems.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-1 text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                      activeHeading === item.id
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400'
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
          <article className='prose prose-lg dark:prose-invert max-w-none'>
            <ReactMarkdown
              components={components}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              remarkPlugins={[remarkGfm]}
            >
              {sanitizedContent}
            </ReactMarkdown>
          </article>

          {/* Social Sharing */}
          {showSocialShare && (
            <div className='mt-8 pt-8 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between flex-wrap gap-4'>
                <div className='flex items-center gap-2'>
                  <Share className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Share this article
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <button
                    onClick={shareOnTwitter}
                    className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                    aria-label='Share on Twitter'
                  >
                    <Twitter className='w-4 h-4' />
                    <span className='hidden sm:inline'>Twitter</span>
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                    aria-label='Share on LinkedIn'
                  >
                    <Linkedin className='w-4 h-4' />
                    <span className='hidden sm:inline'>LinkedIn</span>
                  </button>
                  <button
                    onClick={shareOnFacebook}
                    className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                    aria-label='Share on Facebook'
                  >
                    <Facebook className='w-4 h-4' />
                    <span className='hidden sm:inline'>Facebook</span>
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                    aria-label='Copy link'
                  >
                    {copySuccess === 'copied' ? (
                      <Check className='w-4 h-4 text-green-600' />
                    ) : (
                      <Copy className='w-4 h-4' />
                    )}
                    <span className='hidden sm:inline'>
                      {copySuccess === 'copied'
                        ? 'Copied!'
                        : copySuccess === 'error'
                          ? 'Error'
                          : 'Copy'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
