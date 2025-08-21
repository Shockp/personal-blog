/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Enable experimental features
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            value: getContentSecurityPolicy(),
          },
        ],
      },
    ];
  },

  // Redirect configuration
  async redirects() {
    return [
      // Add any redirects here
    ];
  },

  // Rewrite configuration
  async rewrites() {
    return [
      // Add any rewrites here
    ];
  },

  // Webpack configuration
  webpack: config => {
    // Add custom webpack configuration here
    return config;
  },

  // Environment variables to expose to the browser
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Output configuration
  output: 'standalone',

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,

  // Generate ETags
  generateEtags: true,

  // Trailing slash
  trailingSlash: false,
};

/**
 * Generate Content Security Policy
 * @returns {string} CSP header value
 */
function getContentSecurityPolicy() {
  const isDev = process.env.NODE_ENV === 'development';

  // Base CSP directives
  const csp = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Required for Next.js in development
      "'unsafe-inline'", // Required for Next.js
      'https://vercel.live',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components and CSS-in-JS
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://images.unsplash.com',
      'https://via.placeholder.com',
      'https://picsum.photos',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'https://fonts.googleapis.com',
    ],
    'connect-src': [
      "'self'",
      'https://vercel.live',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://vitals.vercel-insights.com',
    ],
    'frame-src': [
      "'self'",
      'https://www.youtube.com',
      'https://player.vimeo.com',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  };

  // Add development-specific directives
  if (isDev) {
    csp['script-src'].push("'unsafe-eval'");
    csp['connect-src'].push('ws://localhost:*', 'http://localhost:*');
  }

  // Convert CSP object to string
  return Object.entries(csp)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key;
      }
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

module.exports = nextConfig;
