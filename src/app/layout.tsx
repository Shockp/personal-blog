import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';

// Import environment validation to ensure it runs on startup
import '@/lib/env';

// Layout components
import ConditionalLayout from '@/components/layout/ConditionalLayout';

// Theme provider
import { ThemeProvider } from '@/contexts/ThemeContext';

// Structured data components
import WebSiteStructuredData from '@/components/seo/WebSiteStructuredData';
import AuthorStructuredData from '@/components/seo/AuthorStructuredData';

// CSP nonce utility
import { getNonce } from '@/lib/nonce';

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
  title: 'AFB Tech Blog - Software Engineering Excellence',
  description:
    'AFB Tech Blog: Insights on software engineering, scalable architecture, design patterns, and modern development practices.',
  keywords: [
    'afb tech blog',
    'software engineering',
    'scalable architecture',
    'design patterns',
    'clean code',
    'nextjs',
    'typescript',
    'programming',
    'technology',
  ],
  authors: [{ name: 'AFB Tech Blog' }],
  creator: 'AFB Tech Blog',
  publisher: 'AFB Tech Blog',
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
    title: 'AFB Tech Blog - Software Engineering Excellence',
    description:
      'AFB Tech Blog: Insights on software engineering, scalable architecture, design patterns, and modern development practices.',
    siteName: 'AFB Tech Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFB Tech Blog - Software Engineering Excellence',
    description:
      'AFB Tech Blog: Insights on software engineering, scalable architecture, design patterns, and modern development practices.',
    creator: '@afbtechblog',
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
  icons: {
    icon: [
      { url: '/favicon-32.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon-64.svg', sizes: '64x64', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon-32.svg',
    apple: '/favicon-64.svg',
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

        {/* Note: Google Fonts preconnect is handled automatically by next/font/google */}

        {/* Inline theme script - runs before first paint to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var theme;
                  
                  // If no stored theme, use system preference
                  if (!storedTheme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  } else {
                    // Use stored theme if valid, otherwise fall back to system preference
                    theme = (storedTheme === 'dark' || storedTheme === 'light') 
                      ? storedTheme 
                      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  var de = document.documentElement;
                  if (theme === 'dark') {
                    de.classList.add('dark');
                  } else {
                    de.classList.remove('dark');
                  }
                  de.setAttribute('data-theme', theme);
                } catch (e) {
                  // Fallback to system preference on error, or light if that fails
                  var fallbackTheme = 'light';
                  try {
                    fallbackTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  } catch (e2) {}
                  
                  document.documentElement.classList.remove('dark');
                  if (fallbackTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                  document.documentElement.setAttribute('data-theme', fallbackTheme);
                }
              })();
            `,
          }}
        />

        {/* Global Structured Data */}
        <WebSiteStructuredData />
        <AuthorStructuredData />
      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
