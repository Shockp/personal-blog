import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO';

// SEO metadata for the about page
export const metadata = generateSEOMetadata({
  title: 'About',
  description:
    'Learn more about Adrián Feito Blázquez, a passionate web developer with over 5 years of experience specializing in React, TypeScript, and modern web technologies.',
  keywords: [
    'adrián feito blázquez',
    'web developer',
    'react developer',
    'typescript',
    'frontend developer',
    'full stack developer',
    'about',
  ],
  type: 'website',
  url: '/about',
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
