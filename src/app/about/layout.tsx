import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO';

// SEO metadata for the about page
export const metadata = generateSEOMetadata({
  title: 'About AFB',
  description:
    'Learn more about AFB Tech Blog, a platform dedicated to software engineering excellence, scalable architecture, and modern development practices.',
  keywords: [
    'afb tech blog',
    'software engineering',
    'scalable architecture',
    'design patterns',
    'clean code',
    'development practices',
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
