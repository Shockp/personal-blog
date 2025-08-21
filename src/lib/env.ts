import { z } from 'zod';

/**
 * Environment variable validation schema
 * This ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),

  // Application settings
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Personal Blog'),
  NEXT_PUBLIC_APP_DESCRIPTION: z
    .string()
    .default('A modern personal blog built with Next.js'),

  // Database (optional for now)
  DATABASE_URL: z.string().optional(),

  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),

  // OAuth providers (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Content management
  CONTENT_SOURCE: z.enum(['filesystem', 'cms', 'api']).default('filesystem'),
  CONTENT_DIR: z.string().default('./content'),

  // Email configuration (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM_EMAIL: z.string().email().optional(),
  SMTP_FROM_NAME: z.string().optional(),

  // Analytics (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS: z.coerce.boolean().default(false),
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Search configuration
  SEARCH_PROVIDER: z.enum(['local', 'algolia']).default('local'),
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().optional(),
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: z.string().optional(),
  ALGOLIA_ADMIN_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME: z.string().optional(),

  // Media and storage
  IMAGE_PROVIDER: z.enum(['local', 'cloudinary', 's3']).default('local'),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET_NAME: z.string().optional(),

  // Security settings
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  CSP_REPORT_URI: z.string().url().optional(),

  // Development and debugging
  DEBUG: z.coerce.boolean().default(false),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_REQUESTS: z.coerce.boolean().default(false),

  // Feature flags
  NEXT_PUBLIC_ENABLE_COMMENTS: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_NEWSLETTER: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_SEARCH: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_DARK_MODE: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),

  // External services
  MAILCHIMP_API_KEY: z.string().optional(),
  MAILCHIMP_AUDIENCE_ID: z.string().optional(),
  NEXT_PUBLIC_DISQUS_SHORTNAME: z.string().optional(),

  // Social media
  TWITTER_API_KEY: z.string().optional(),
  TWITTER_API_SECRET: z.string().optional(),
  TWITTER_ACCESS_TOKEN: z.string().optional(),
  TWITTER_ACCESS_TOKEN_SECRET: z.string().optional(),

  // Performance and caching
  REDIS_URL: z.string().url().optional(),
  CACHE_TTL: z.coerce.number().int().positive().default(3600),
  ENABLE_STATIC_CACHE: z.coerce.boolean().default(true),
});

/**
 * Validated environment variables
 * This will throw an error if any required variables are missing or invalid
 */
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ Environment validation failed:');
  if (error instanceof z.ZodError) {
    // eslint-disable-next-line no-console
    console.error('Missing or invalid environment variables:');
    // eslint-disable-next-line no-console
    console.error(
      error.issues
        .map(err => `  - ${err.path.join('.')}: ${err.message}`)
        .join('\n')
    );
    // eslint-disable-next-line no-console
    console.error(
      '\nPlease check your .env.local file and ensure all required variables are set.'
    );
    // eslint-disable-next-line no-console
    console.error(
      'Refer to .env.example for the complete list of required variables.'
    );
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  throw error;
}

/**
 * Type-safe environment variables
 * Use this instead of process.env to get full TypeScript support
 */
export { env };

/**
 * Utility function to check if we're in development mode
 */
export const isDev = env.NODE_ENV === 'development';

/**
 * Utility function to check if we're in production mode
 */
export const isProd = env.NODE_ENV === 'production';

/**
 * Utility function to check if we're in staging mode
 */
export const isStaging = env.NODE_ENV === 'staging';

/**
 * Utility function to get the app URL with proper protocol
 */
export const getAppUrl = () => {
  const url = env.NEXT_PUBLIC_APP_URL;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

/**
 * Utility function to check if a feature is enabled
 */
export const isFeatureEnabled = (feature: keyof typeof env) => {
  return Boolean(env[feature]);
};

/**
 * Utility function to get CORS origins as an array
 */
export const getCorsOrigins = () => {
  return env.CORS_ORIGINS.split(',').map(origin => origin.trim());
};

/**
 * Utility function to validate environment on startup
 * Call this in your main application file
 */
export const validateEnvironment = () => {
  // eslint-disable-next-line no-console
  console.log('✅ Environment variables validated successfully');

  if (isDev) {
    // eslint-disable-next-line no-console
    console.log('🔧 Running in development mode');
    // eslint-disable-next-line no-console
    console.log(`📍 App URL: ${env.NEXT_PUBLIC_APP_URL}`);
    // eslint-disable-next-line no-console
    console.log(`📝 Content source: ${env.CONTENT_SOURCE}`);
    // eslint-disable-next-line no-console
    console.log(`🔍 Search provider: ${env.SEARCH_PROVIDER}`);
    // eslint-disable-next-line no-console
    console.log(`🖼️  Image provider: ${env.IMAGE_PROVIDER}`);
  }
};

// Validate environment on module load
validateEnvironment();
