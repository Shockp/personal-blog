import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Code, Github, Linkedin, Mail } from '@/components/ui/icons';
import { getAllPosts } from '@/lib/posts';
import { getRecentProjects } from '@/lib/projects';
import PostCard from '@/components/blog/PostCard';
import ProjectCard, { ProjectCardSkeleton } from '@/components/projects/ProjectCard';
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO';

// SEO metadata for the home page
export const metadata = generateSEOMetadata({
  title: 'AFB Tech Blog - Software Engineering Excellence',
  description:
    'AFB Tech Blog - Your go-to resource for software engineering excellence, scalable architecture patterns, and cutting-edge development insights. Explore in-depth articles on design patterns, clean architecture, SOLID principles, and modern development practices.',
  keywords: [
    'afb tech blog',
    'software engineering',
    'scalable architecture',
    'design patterns',
    'clean architecture',
    'solid principles',
    'backend development',
    'software architecture',
    'programming best practices',
    'react',
    'typescript',
    'nextjs',
    'javascript',
    'java',
    'hexagonal architecture',
    'tech blog',
    'developer insights',
  ],
  type: 'website',
  url: '/',
});

// Optimized skeleton component for better performance
const PostCardSkeleton = () => (
  <div
    className='rounded-lg shadow-md overflow-hidden animate-pulse'
    style={{ backgroundColor: 'var(--card-background)' }}
  >
    <div className='h-48' style={{ backgroundColor: 'var(--muted)' }}></div>
    <div className='p-6'>
      <div
        className='h-4 rounded mb-2'
        style={{ backgroundColor: 'var(--muted)' }}
      ></div>
      <div
        className='h-4 rounded w-3/4 mb-4'
        style={{ backgroundColor: 'var(--muted)' }}
      ></div>
      <div
        className='h-3 rounded w-1/2'
        style={{ backgroundColor: 'var(--muted)' }}
      ></div>
    </div>
  </div>
);

/**
 * Home Page Component
 *
 * The main landing page of the personal blog featuring:
 * - Hero section with personal introduction and call-to-action
 * - Recent posts preview section displaying the latest 3 blog posts
 * - Call-to-action sections for user engagement
 * - SEO optimization with structured data (JSON-LD)
 * - Responsive design for all device sizes
 * - Performance optimizations (preload hints, optimized loading states)
 * - Full theme system integration with dark mode support
 * - Accessibility features including ARIA labels and semantic HTML
 *
 * Performance targets:
 * - First Contentful Paint (FCP) < 1.5s
 * - Largest Contentful Paint (LCP) < 2.5s
 * - Cumulative Layout Shift (CLS) < 0.1
 *
 * @returns {JSX.Element} The complete home page with all sections
 */
export default async function Home() {
  // Fetch recent posts (limit to 3 for homepage)
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 3);
  
  // Fetch recent projects (limit to 3 for homepage)
  const recentProjects = getRecentProjects(3);

  return (
    <>
      {/* Preload critical resources */}
      <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossOrigin='anonymous'
      />

      {/* Structured Data is handled in layout.tsx to prevent duplication */}

      <main className='min-h-screen'>
        {/* Hero Section */}
        <section
          className='relative py-20 sm:py-32'
          style={{
            background: `linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-to))`,
          }}
          aria-labelledby='hero-heading'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center space-y-6 sm:space-y-8'>
              <div className='space-y-3 sm:space-y-4'>
                <h1
                  className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'
                  style={{ color: 'var(--foreground)' }}
                >
                  Welcome to{' '}
                  <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                    AFB Tech Blog
                  </span>
                </h1>
                <p
                  className='text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto px-4 sm:px-0'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Your go-to resource for software engineering excellence,
                  scalable architecture patterns, and cutting-edge development
                  insights. Explore in-depth articles on design patterns, clean
                  architecture, and modern development practices.
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0'>
                <Link
                  href='/blog'
                  className='w-full sm:w-auto group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-500 shadow-lg hover:shadow-xl min-h-[44px] text-base sm:text-lg'
                >
                  <BookOpen className='mr-2 h-5 w-5 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
                  <span className='group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500'>
                    Explore Articles
                  </span>
                </Link>
                <Link
                  href='/about'
                  className='w-full sm:w-auto group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-border hover:border-primary text-foreground hover:text-primary font-semibold rounded-lg transition-all duration-500 hover:shadow-lg min-h-[44px] text-base sm:text-lg'
                >
                  <Users className='mr-2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-500' />
                  <span className='transition-colors duration-500'>
                    About Me
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section
          className='py-12 sm:py-16 lg:py-20'
          style={{ backgroundColor: 'var(--background)' }}
          aria-labelledby='social-links-heading'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center space-y-6 sm:space-y-8'>
              <div className='space-y-3 sm:space-y-4'>
                <h2
                  id='social-links-heading'
                  className='text-2xl sm:text-3xl md:text-4xl font-bold'
                  style={{ color: 'var(--foreground)' }}
                >
                  Connect With Me
                </h2>
                <p
                  className='text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Follow my journey in software engineering and stay updated with the latest insights, projects, and tech discussions.
                </p>
              </div>
              
              <div className='mt-4 flex justify-center space-x-6'>
                <a
                  href='https://github.com/shockp'
                  className='transition-colors duration-200 focus:outline-none'
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label='GitHub Profile (opens in new tab)'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path fillRule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' clipRule='evenodd'></path>
                  </svg>
                </a>
                <a
                  href='https://www.linkedin.com/in/adrian-feito-blazquez-404276209/'
                  className='transition-colors duration-200 focus:outline-none'
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label='LinkedIn Profile (opens in new tab)'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path fillRule='evenodd' d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' clipRule='evenodd'></path>
                  </svg>
                </a>
                <a
                  href='https://app.hackthebox.com/profile/1317035/'
                  className='transition-colors duration-200 focus:outline-none'
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label='HackTheBox Profile (opens in new tab)'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M11.996 0a1.119 1.119 0 0 0-.057.003.9.9 0 0 0-.236.05.907.907 0 0 0-.165.079L1.936 5.675a.889.889 0 0 0-.445.77v11.111a.889.889 0 0 0 .47.784l9.598 5.541.054.029v.002a.857.857 0 0 0 .083.035l.012.004c.028.01.056.018.085.024.01.001.011.003.016.004a.93.93 0 0 0 .296.015.683.683 0 0 0 .086-.015c.01 0 .011-.002.016-.004a.94.94 0 0 0 .085-.024l.012-.004a.882.882 0 0 0 .083-.035v-.002a1.086 1.086 0 0 0 .054-.029l9.599-5.541a.889.889 0 0 0 .469-.784V6.48l-.001-.026v-.008a.889.889 0 0 0-.312-.676l-.029-.024c0-.002-.01-.005-.01-.007a.899.899 0 0 0-.107-.07L12.453.127A.887.887 0 0 0 11.99 0zm.01 2.253c.072 0 .144.019.209.056l6.537 3.774a.418.418 0 0 1 0 .724l-6.537 3.774a.418.418 0 0 1-.418 0L5.26 6.807a.418.418 0 0 1 0-.724l6.537-3.774a.42.42 0 0 1 .209-.056zm-8.08 6.458a.414.414 0 0 1 .215.057l6.524 3.766a.417.417 0 0 1 .208.361v7.533a.417.417 0 0 1-.626.361l-6.523-3.766a.417.417 0 0 1-.209-.362V9.13c0-.241.196-.414.41-.418zm16.16 0c.215.004.41.177.41.418v7.532a.42.42 0 0 1-.208.362l-6.524 3.766a.417.417 0 0 1-.626-.361v-7.533c0-.149.08-.286.209-.36l6.523-3.767a.415.415 0 0 1 .216-.057z'></path>
                  </svg>
                </a>
                <a
                  href='https://leetcode.com/u/shockp/'
                  className='transition-colors duration-200 focus:outline-none'
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label='LeetCode Profile (opens in new tab)'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z'></path>
                  </svg>
                </a>
              </div>
              
              <div className='mt-6'>
                <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
                  Get in touch: <a href='mailto:shockp.developer@gmail.com' className='font-medium transition-colors duration-500' style={{ color: 'var(--text-accent)' }}>shockp.developer@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section
          className='py-12 sm:py-16 lg:py-20'
          style={{ backgroundColor: 'var(--muted)' }}
          aria-labelledby='recent-posts-heading'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-8 sm:mb-10 lg:mb-12'>
              <h2
                id='recent-posts-heading'
                className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4'
                style={{ color: 'var(--foreground)' }}
              >
                Recent Posts
              </h2>
              <p
                className='text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Discover the latest insights on software engineering,
                architecture patterns, and cutting-edge development practices.
              </p>
            </div>

            <Suspense
              fallback={
                <div
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  aria-label='Loading recent blog posts'
                >
                  {[...Array(3)].map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <div
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                role='list'
                aria-label='Recent blog posts'
              >
                {recentPosts.map(post => (
                  <div key={post.slug} role='listitem'>
                    <PostCard post={post} priority={true} />
                  </div>
                ))}
              </div>
            </Suspense>

            <div className='flex justify-center mt-8 sm:mt-10 lg:mt-12 px-4 sm:px-0'>
              <Link
                href='/blog'
                className='w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-500 group min-h-[44px] text-base sm:text-lg'
                prefetch={false}
              >
                <span className='group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500'>
                  View All Posts
                </span>
                <ArrowRight className='ml-2 h-4 w-4 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Projects Section */}
        <section
          className='py-12 sm:py-16 lg:py-20'
          style={{ backgroundColor: 'var(--background)' }}
          aria-labelledby='recent-projects-heading'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-8 sm:mb-10 lg:mb-12'>
              <h2
                id='recent-projects-heading'
                className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4'
                style={{ color: 'var(--foreground)' }}
              >
                Recent Projects
              </h2>
              <p
                className='text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Explore my latest projects showcasing modern development practices,
                innovative solutions, and technical expertise across various domains.
              </p>
            </div>

            <Suspense
              fallback={
                <div
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  aria-label='Loading recent projects'
                >
                  {[...Array(3)].map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <div
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                role='list'
                aria-label='Recent projects'
              >
                {recentProjects.map(project => (
                  <div key={project.id} role='listitem'>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </Suspense>

            <div className='flex justify-center mt-8 sm:mt-10 lg:mt-12 px-4 sm:px-0'>
              <Link
                href='/projects'
                className='w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-500 group min-h-[44px] text-base sm:text-lg'
                prefetch={false}
              >
                <Code className='mr-2 h-4 w-4 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
                <span className='group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500'>
                  View All Projects
                </span>
                <ArrowRight className='ml-2 h-4 w-4 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
