import type { Metadata } from 'next';
import {
  Mail,
  MapPin,
  Calendar,
  Code,
  Database,
  Globe,
  Smartphone,
  Users,
  Award,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Personal Blog',
  description:
    'Learn more about Adrian, a passionate web developer specializing in React, TypeScript, and modern web technologies.',
  keywords: [
    'about',
    'developer',
    'web development',
    'react',
    'typescript',
    'nextjs',
  ],
  openGraph: {
    title: 'About Adrian | Personal Blog',
    description:
      'Learn more about Adrian, a passionate web developer specializing in React, TypeScript, and modern web technologies.',
    type: 'profile',
    url: '/about',
  },
  twitter: {
    card: 'summary',
    title: 'About Adrian | Personal Blog',
    description:
      'Learn more about Adrian, a passionate web developer specializing in React, TypeScript, and modern web technologies.',
  },
};

/**
 * About Page Component
 *
 * Comprehensive about page featuring:
 * - Personal introduction with professional photo placeholder
 * - Skills and expertise showcase with visual indicators
 * - Contact information with multiple channels
 * - Professional background and experience timeline
 * - Responsive design optimized for all devices
 * - SEO optimization with structured data
 * - Accessibility features and semantic HTML
 */
export default function AboutPage() {
  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adrian',
    jobTitle: 'Web Developer',
    description:
      'A passionate web developer specializing in React, TypeScript, and modern web technologies.',
    url: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/about`
      : 'http://localhost:3000/about',
    knowsAbout: [
      'Web Development',
      'React',
      'TypeScript',
      'Next.js',
      'JavaScript',
      'Node.js',
      'Database Design',
      'UI/UX Design',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'University of Technology',
    },
  };

  const skills = [
    { name: 'React & Next.js', level: 95, icon: Code, color: 'bg-blue-500' },
    { name: 'TypeScript', level: 90, icon: Code, color: 'bg-blue-600' },
    {
      name: 'Node.js & APIs',
      level: 85,
      icon: Database,
      color: 'bg-green-500',
    },
    {
      name: 'UI/UX Design',
      level: 80,
      icon: Smartphone,
      color: 'bg-purple-500',
    },
    {
      name: 'Database Design',
      level: 75,
      icon: Database,
      color: 'bg-orange-500',
    },
    {
      name: 'DevOps & Deployment',
      level: 70,
      icon: Globe,
      color: 'bg-red-500',
    },
  ];

  const experiences = [
    {
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      period: '2022 - Present',
      description:
        'Leading frontend development for enterprise applications using React, TypeScript, and Next.js. Mentoring junior developers and establishing best practices.',
      achievements: [
        'Improved application performance by 40%',
        'Led migration to TypeScript across 5 major projects',
        'Mentored 3 junior developers',
      ],
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Innovations Ltd.',
      period: '2020 - 2022',
      description:
        'Developed and maintained full-stack web applications using modern technologies. Collaborated with design and product teams to deliver user-centric solutions.',
      achievements: [
        'Built 10+ responsive web applications',
        'Implemented automated testing reducing bugs by 60%',
        'Optimized database queries improving load times by 50%',
      ],
    },
    {
      title: 'Junior Web Developer',
      company: 'StartUp Ventures',
      period: '2019 - 2020',
      description:
        'Started my professional journey building websites and learning modern web development practices. Gained experience in React, Node.js, and agile development.',
      achievements: [
        'Completed 15+ client projects',
        'Learned React and modern JavaScript',
        'Contributed to open-source projects',
      ],
    },
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className='min-h-screen bg-white dark:bg-gray-900'>
        {/* Hero Section - Personal Introduction */}
        <section className='relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 sm:py-32'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              {/* Text Content */}
              <div className='text-center lg:text-left'>
                <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
                  Hi, I&apos;m{' '}
                  <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Adrian
                  </span>
                </h1>
                <p className='text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed'>
                  A passionate web developer with over 5 years of experience
                  creating modern, user-friendly applications. I specialize in
                  React, TypeScript, and building scalable web solutions that
                  make a difference.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                  <Link
                    href='/blog'
                    className='inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 group'
                  >
                    <Code className='w-5 h-5 mr-2' />
                    View My Work
                    <ExternalLink className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200' />
                  </Link>
                  <a
                    href='#contact'
                    className='inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-colors duration-200'
                  >
                    <Mail className='w-5 h-5 mr-2' />
                    Get In Touch
                  </a>
                </div>
              </div>

              {/* Profile Image Placeholder */}
              <div className='flex justify-center lg:justify-end'>
                <div className='relative'>
                  <div className='w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl'>
                    <Users className='w-32 h-32 text-white' />
                  </div>
                  <div className='absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg'>
                    <Code className='w-8 h-8 text-blue-600' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills & Expertise Section */}
        <section className='py-20 bg-gray-50 dark:bg-gray-800'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                Skills & Expertise
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                I&apos;m passionate about staying current with the latest
                technologies and best practices in web development.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {skills.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <div
                    key={index}
                    className='bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200'
                  >
                    <div className='flex items-center mb-4'>
                      <div className={`p-3 rounded-lg ${skill.color} mr-4`}>
                        <IconComponent className='w-6 h-6 text-white' />
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {skill.name}
                        </h3>
                        <div className='mt-2'>
                          <div className='bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                            <div
                              className={`h-2 rounded-full ${skill.color} transition-all duration-1000 ease-out`}
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                          <span className='text-sm text-gray-500 dark:text-gray-400 mt-1 block'>
                            {skill.level}% Proficiency
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Professional Background Section */}
        <section className='py-20 bg-white dark:bg-gray-900'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                Professional Background
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                My journey in web development has been filled with exciting
                challenges and continuous learning.
              </p>
            </div>

            <div className='relative'>
              {/* Timeline line */}
              <div className='absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600'></div>

              {experiences.map((experience, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline dot */}
                  <div className='absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 z-10'></div>

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
                  >
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200'>
                      <div className='flex items-center mb-3'>
                        <Calendar className='w-5 h-5 text-blue-600 mr-2' />
                        <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                          {experience.period}
                        </span>
                      </div>
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                        {experience.title}
                      </h3>
                      <p className='text-lg text-gray-600 dark:text-gray-300 mb-3'>
                        {experience.company}
                      </p>
                      <p className='text-gray-600 dark:text-gray-400 mb-4'>
                        {experience.description}
                      </p>
                      <div className='space-y-2'>
                        <h4 className='font-semibold text-gray-900 dark:text-white flex items-center'>
                          <Award className='w-4 h-4 mr-2' />
                          Key Achievements:
                        </h4>
                        <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1'>
                          {experience.achievements.map(
                            (achievement, achievementIndex) => (
                              <li key={achievementIndex}>{achievement}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section
          id='contact'
          className='py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                Let&apos;s Connect
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                I&apos;m always interested in new opportunities and
                collaborations. Feel free to reach out!
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {/* Email */}
              <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 text-center'>
                <div className='bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                  <Mail className='w-8 h-8 text-blue-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  Email
                </h3>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>
                  Let&apos;s discuss your project
                </p>
                <a
                  href='mailto:adrian@example.com'
                  className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200'
                >
                  adrian@example.com
                </a>
              </div>

              {/* Location */}
              <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 text-center'>
                <div className='bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                  <MapPin className='w-8 h-8 text-green-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  Location
                </h3>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>
                  Available for remote work
                </p>
                <p className='text-gray-700 dark:text-gray-300 font-medium'>
                  San Francisco, CA
                </p>
              </div>

              {/* Social */}
              <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 text-center md:col-span-2 lg:col-span-1'>
                <div className='bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                  <Globe className='w-8 h-8 text-purple-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  Social Media
                </h3>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>
                  Follow my journey
                </p>
                <div className='flex justify-center space-x-4'>
                  <a
                    href='https://github.com/adrian'
                    className='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200'
                    aria-label='GitHub Profile'
                  >
                    GitHub
                  </a>
                  <a
                    href='https://linkedin.com/in/adrian'
                    className='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200'
                    aria-label='LinkedIn Profile'
                  >
                    LinkedIn
                  </a>
                  <a
                    href='https://twitter.com/adrian'
                    className='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200'
                    aria-label='Twitter Profile'
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className='text-center mt-12'>
              <Link
                href='/blog'
                className='inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 group'
              >
                <Code className='w-5 h-5 mr-2' />
                Check Out My Blog
                <ExternalLink className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200' />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
