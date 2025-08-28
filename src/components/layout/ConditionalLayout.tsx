'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

/**
 * Conditional layout component that hides Header and Footer on the root URL (/)
 * Shows Header and Footer on all other pages
 */
export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isRootPage = pathname === '/';

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200'
      >
        Skip to main content
      </a>

      {/* Navigation Header - hidden on root page */}
      {!isRootPage && <Header />}

      {/* Main Content Area */}
      <main id='main-content' className='flex-1' role='main'>
        {children}
      </main>

      {/* Footer - hidden on root page */}
      {!isRootPage && <Footer />}
    </>
  );
}
