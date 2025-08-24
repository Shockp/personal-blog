import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600, // Increased cache TTL to 1 hour
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Asset optimization
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  generateEtags: true, // Generate ETags for better caching

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'date-fns'], // Optimize specific package imports
  },
  // External packages for server components (moved from experimental)
  serverExternalPackages: ['highlight.js', 'rehype-highlight'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Temporarily ignore ESLint warnings during bundle analysis and monitoring
    ignoreDuringBuilds:
      process.env.ANALYZE === 'true' || process.env.BUILD_MONITOR === 'true',
  },
  // Security headers are now handled by middleware.ts for dynamic nonce support
  // This allows for proper CSP nonce injection per request
  // Webpack optimizations for code splitting and asset optimization
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

      // Optimize asset modules for better caching
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }

    // Asset optimization rules
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024, // 8kb - inline small assets
        },
      },
    });

    return config;
  },
};

export default bundleAnalyzer(nextConfig);
