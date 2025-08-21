import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';

// Import environment validation to ensure it runs on startup
import '@/lib/env';

// Layout components
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

// Theme provider
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Personal Blog',
  description: 'A modern personal blog built with Next.js',
  keywords: ['blog', 'personal', 'nextjs', 'typescript', 'tailwind'],
  authors: [{ name: 'Blog Author' }],
  creator: 'Blog Author',
  publisher: 'Blog Author',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'Personal Blog',
    description: 'A modern personal blog built with Next.js',
    siteName: 'Personal Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Blog',
    description: 'A modern personal blog built with Next.js',
    creator: '@yourusername',
  },
  robots: {
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
};

/**
 * Root layout component for the entire application
 * Provides global structure with navigation, main content area, and footer
 * Includes font configuration, metadata, and accessibility features
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
          >
            Skip to main content
          </a>
          
          {/* Navigation Header */}
          <Navigation />
          
          {/* Main Content Area */}
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
