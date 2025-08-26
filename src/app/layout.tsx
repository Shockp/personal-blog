import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';

// Import environment validation to ensure it runs on startup
import '@/lib/env';

// Layout components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Theme provider
import { ThemeProvider } from '@/contexts/ThemeContext';

// Structured data components
import WebSiteStructuredData from '@/components/seo/WebSiteStructuredData';
import AuthorStructuredData from '@/components/seo/AuthorStructuredData';

// CSP nonce utility
import { getNonce } from '@/lib/nonce';
import ThemeScript from '@/components/ThemeScript';

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
  title: 'Adrián Feito Blázquez - Personal Blog',
  description:
    'Personal blog by Adrián Feito Blázquez covering software development, technology, and programming insights.',
  keywords: [
    'blog',
    'personal',
    'nextjs',
    'typescript',
    'tailwind',
    'software development',
    'programming',
    'technology',
  ],
  authors: [{ name: 'Adrián Feito Blázquez' }],
  creator: 'Adrián Feito Blázquez',
  publisher: 'Adrián Feito Blázquez',
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
    title: 'Adrián Feito Blázquez - Personal Blog',
    description:
      'Personal blog by Adrián Feito Blázquez covering software development, technology, and programming insights.',
    siteName: 'Adrián Feito Blázquez - Personal Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adrián Feito Blázquez - Personal Blog',
    description:
      'Personal blog by Adrián Feito Blázquez covering software development, technology, and programming insights.',
    creator: '@adrianfeito',
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
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = await getNonce();

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* CSP Nonce meta tag for client components */}
        <meta name='csp-nonce' content={nonce} />

        {/* Resource preloading hints for critical resources */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link rel='dns-prefetch' href='https://fonts.googleapis.com' />
        <link rel='dns-prefetch' href='https://fonts.gstatic.com' />

        {/* Theme initialization will be handled by ThemeScript component */}

        {/* Global Structured Data */}
        <WebSiteStructuredData />
        <AuthorStructuredData />
      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeScript />
        <ThemeProvider>
          {/* Skip to main content link for accessibility */}
          <a
            href='#main-content'
            className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200'
          >
            Skip to main content
          </a>

          {/* Navigation Header */}
          <Header />

          {/* Main Content Area */}
          <main id='main-content' className='flex-1' role='main'>
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
