import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO';

// SEO metadata for the loading page
export const metadata = generateSEOMetadata({
  title: 'Loading - AFB Tech Blog',
  description: 'AFB Tech Blog is loading. Please wait while we prepare your content.',
  type: 'website',
  url: '/loading',
});

/**
 * Loading Page Component
 * 
 * A theme-adaptive loading screen that displays a spinner animation
 * with AFB Tech Blog branding. Uses existing CSS variables for theming
 * and maintains consistency with the overall design system.
 * 
 * Features:
 * - Theme-adaptive design (light/dark mode)
 * - Responsive layout
 * - Accessibility features
 * - Smooth animations
 * - AFB Tech Blog branding
 */
export default function LoadingPage() {

  return (
    <main 
      className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50"
      style={{ backgroundColor: 'var(--background)' }}
      role="main"
      aria-label="Loading page"
    >
      <div className="text-center space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Loading Spinner */}
        <div 
          className="relative mx-auto w-20 h-20"
          role="status"
          aria-label="Loading content"
        >
          <div 
            className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"
          />
          <div 
            className="absolute inset-2 rounded-full border-2 border-purple-200 border-r-purple-600 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />
        </div>

        {/* Brand Title */}
        <div className="space-y-4">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{ color: 'var(--foreground)' }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AFB Tech Blog
            </span>
          </h1>
          
          <p 
            className="text-lg sm:text-xl max-w-md mx-auto"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Loading amazing content...
          </p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1.4s'
              }}
            />
          ))}
        </div>
      </div>


    </main>
  );
}
