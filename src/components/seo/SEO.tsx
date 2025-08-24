import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'Personal Blog';
const DEFAULT_DESCRIPTION = 'A modern personal blog built with Next.js';
const DEFAULT_KEYWORDS = [
  'blog',
  'personal',
  'nextjs',
  'typescript',
  'tailwind',
];
const SITE_NAME = 'Personal Blog';
const TWITTER_HANDLE = '@yourusername';
const AUTHOR_NAME = 'Blog Author';

/**
 * Generate comprehensive metadata for SEO, Open Graph, and Twitter Cards
 * @param props SEO configuration options
 * @returns Next.js Metadata object
 */
export function generateMetadata(props: SEOProps = {}): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = DEFAULT_KEYWORDS,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = AUTHOR_NAME,
    tags = [],
    noIndex = false,
  } = props;

  // Construct full title
  const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;

  // Base URL for the site
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Construct full URL
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;

  // Default image for social sharing
  const defaultImage = `${baseUrl}/images/og-default.jpg`;
  const fullImage = image ? `${baseUrl}${image}` : defaultImage;

  // Combine keywords with tags
  const allKeywords = [...keywords, ...tags].filter(Boolean);

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: author }],
    creator: author,
    publisher: AUTHOR_NAME,

    // Canonical URL
    alternates: {
      canonical: fullUrl,
    },

    // Robots configuration
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },

    // Open Graph tags
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || DEFAULT_TITLE,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author],
        tags: allKeywords,
      }),
    },

    // Twitter Card tags
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: fullTitle,
      description,
      images: [fullImage],
    },

    // Additional meta tags
    other: {
      // Prevent format detection
      'format-detection': 'telephone=no, date=no, email=no, address=no',

      // Theme color for mobile browsers
      'theme-color': '#ffffff',

      // Apple touch icon
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',

      // Microsoft tiles
      'msapplication-TileColor': '#ffffff',

      // Article specific meta tags
      ...(type === 'article' &&
        publishedTime && {
          'article:published_time': publishedTime,
        }),
      ...(type === 'article' &&
        modifiedTime && {
          'article:modified_time': modifiedTime,
        }),
      ...(type === 'article' &&
        author && {
          'article:author': author,
        }),
    },
  };

  return metadata;
}

/**
 * Generate structured data for blog posts (JSON-LD)
 * @param props SEO configuration options
 * @returns JSON-LD structured data object
 */
export function generateStructuredData(
  props: SEOProps & {
    content?: string;
    readingTime?: number;
  }
) {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    author = AUTHOR_NAME,
    publishedTime,
    modifiedTime,
    image,
    url,
    tags = [],
    content,
    readingTime,
  } = props;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image
    ? `${baseUrl}${image}`
    : `${baseUrl}/images/og-default.jpg`;

  if (props.type === 'article' && title) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      image: fullImage,
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo.png`,
        },
      },
      url: fullUrl,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      keywords: tags.join(', '),
      ...(content && { articleBody: content }),
      ...(readingTime && {
        timeRequired: `PT${readingTime}M`,
      }),
    };
  }

  // Default website structured data
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: baseUrl,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
  };
}

/**
 * SEO utility functions
 */
export const seoUtils = {
  /**
   * Generate meta description from content
   */
  generateDescription: (content: string, maxLength = 160): string => {
    const cleanContent = content
      .replace(/[#*`]/g, '') // Remove markdown
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }

    return cleanContent.substring(0, maxLength - 3).trim() + '...';
  },

  /**
   * Generate keywords from content and tags
   */
  generateKeywords: (content: string, tags: string[] = []): string[] => {
    const contentWords = content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 10);

    return [...new Set([...DEFAULT_KEYWORDS, ...tags, ...contentWords])];
  },

  /**
   * Generate slug from title
   */
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },
};
