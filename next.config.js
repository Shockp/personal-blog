const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizeCss: true,
  },
  // External packages for server components (moved from experimental)
  serverExternalPackages: ['highlight.js', 'rehype-highlight'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Temporarily ignore ESLint warnings during bundle analysis
    ignoreDuringBuilds: process.env.ANALYZE === 'true',
  },
  // Security headers are now handled by middleware.ts for dynamic nonce support
  // This allows for proper CSP nonce injection per request
  // Webpack optimizations for code splitting
  webpack: (config, { dev, isServer }) => {
    // Optimize chunk splitting for better caching
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Separate markdown processing libraries
          markdown: {
            test: /[\\/]node_modules[\\/](react-markdown|rehype-|remark-|unified|micromark)[\\/]/,
            name: 'markdown',
            chunks: 'all',
            priority: 20,
          },
          // Separate syntax highlighting
          highlight: {
            test: /[\\/]node_modules[\\/]highlight\.js[\\/]/,
            name: 'highlight',
            chunks: 'all',
            priority: 20,
          },
          // Common UI components
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
