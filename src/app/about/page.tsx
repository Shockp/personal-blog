'use client';

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
import { useEffect } from 'react';

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
  // Handle metadata for client component
  useEffect(() => {
    document.title = 'About | Personal Blog';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Learn more about Adrian, a passionate web developer specializing in React, TypeScript, and modern web technologies.'
      );
    }
  }, []);

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

      <div className='min-h-screen bg-background'>
        {/* Hero Section - Personal Introduction */}
        <section
          className='relative py-12 sm:py-20 lg:py-32'
          style={{
            background: `linear-gradient(to bottom right, var(--about-gradient-from), var(--about-gradient-via), var(--about-gradient-to))`,
          }}
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center'>
              {/* Text Content */}
              <div className='text-center lg:text-left'>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6'>
                  Hi, I&apos;m{' '}
                  <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Adrian
                  </span>
                </h1>
                <p className='text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0'>
                  A passionate web developer with over 5 years of experience
                  creating modern, user-friendly applications. I specialize in
                  React, TypeScript, and building scalable web solutions that
                  make a difference.
                </p>
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center lg:justify-start'>
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
                    className='inline-flex items-center px-6 py-3 border-2 border-border hover:border-primary text-foreground hover:text-primary font-medium rounded-lg transition-colors duration-200'
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
                  <div className='absolute -bottom-4 -right-4 bg-background border border-border rounded-full p-4 shadow-lg'>
                    <Code className='w-8 h-8 text-blue-600' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills & Expertise Section */}
        <section className='py-12 sm:py-16 lg:py-20 bg-muted/30'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-10 sm:mb-12 lg:mb-16'>
              <h2
                className='text-2xl sm:text-3xl font-bold mb-3 sm:mb-4'
                style={{ color: 'var(--text-primary)' }}
              >
                Skills & Expertise
              </h2>
              <p
                className='text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0'
                style={{ color: 'var(--text-secondary)' }}
              >
                I&apos;m passionate about staying current with the latest
                technologies and best practices in web development.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
              {skills.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <div
                    key={index}
                    className='bg-card rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200'
                  >
                    <div className='flex items-center mb-3 sm:mb-4'>
                      <div
                        className={`p-2 sm:p-3 rounded-lg ${skill.color} mr-3 sm:mr-4`}
                      >
                        <IconComponent className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                      </div>
                      <div className='flex-1'>
                        <h3
                          className='text-base sm:text-lg font-semibold'
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {skill.name}
                        </h3>
                        <div className='mt-2'>
                          <div className='bg-muted rounded-full h-2'>
                            <div
                              className={`h-2 rounded-full ${skill.color} transition-all duration-1000 ease-out`}
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                          <span
                            className='text-xs sm:text-sm mt-1 block'
                            style={{ color: 'var(--text-muted)' }}
                          >
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
        <section className='py-20 bg-background'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <h2
                className='text-3xl font-bold mb-4'
                style={{ color: 'var(--text-primary)' }}
              >
                Professional Background
              </h2>
              <p
                className='text-lg max-w-2xl mx-auto'
                style={{ color: 'var(--text-secondary)' }}
              >
                My journey in web development has been filled with exciting
                challenges and continuous learning.
              </p>
            </div>

            <div className='relative'>
              {/* Timeline line */}
              <div className='absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border'></div>

              {experiences.map((experience, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline dot */}
                  <div className='absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-background z-10'></div>

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
                  >
                    <div className='bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200'>
                      <div className='flex items-center mb-3'>
                        <Calendar className='w-5 h-5 text-blue-600 mr-2' />
                        <span
                          className='text-sm font-medium'
                          style={{ color: 'var(--text-accent)' }}
                        >
                          {experience.period}
                        </span>
                      </div>
                      <h3
                        className='text-xl font-bold mb-2'
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {experience.title}
                      </h3>
                      <p
                        className='text-lg mb-3'
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {experience.company}
                      </p>
                      <p
                        className='mb-4'
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {experience.description}
                      </p>
                      <div className='space-y-2'>
                        <h4
                          className='font-semibold flex items-center'
                          style={{ color: 'var(--text-primary)' }}
                        >
                          <Award className='w-4 h-4 mr-2' />
                          Key Achievements:
                        </h4>
                        <ul
                          className='list-disc list-inside space-y-1'
                          style={{ color: 'var(--text-secondary)' }}
                        >
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
          className='py-12 sm:py-16 lg:py-20'
          style={{
            background: `linear-gradient(to bottom right, var(--about-gradient-from), var(--about-gradient-via), var(--about-gradient-to))`,
          }}
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-10 sm:mb-12 lg:mb-16'>
              <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4'>
                Let&apos;s Connect
              </h2>
              <p className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0'>
                I&apos;m always interested in new opportunities and
                collaborations. Feel free to reach out!
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6'>
              {/* Email */}
              <div className='bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 text-center'>
                <div className='bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                  <Mail className='w-8 h-8 text-blue-600' />
                </div>
                <h3
                  className='text-lg font-semibold mb-2'
                  style={{ color: 'var(--text-primary)' }}
                >
                  Email
                </h3>
                <p className='mb-4' style={{ color: 'var(--text-secondary)' }}>
                  Let&apos;s discuss your project
                </p>
                <a
                  href='mailto:adrian@example.com'
                  className='font-medium transition-colors duration-200'
                  style={{ color: 'var(--text-accent)' }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.color = 'var(--text-primary)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = 'var(--text-accent)')
                  }
                >
                  adrian@example.com
                </a>
              </div>

              {/* Location */}
              <div className='bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 text-center'>
                <div className='bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                  <MapPin className='w-8 h-8 text-green-600' />
                </div>
                <h3
                  className='text-lg font-semibold mb-2'
                  style={{ color: 'var(--text-primary)' }}
                >
                  Location
                </h3>
                <p className='mb-4' style={{ color: 'var(--text-secondary)' }}>
                  Available for remote work
                </p>
                <p
                  className='font-medium'
                  style={{ color: 'var(--text-primary)' }}
                >
                  San Francisco, CA
                </p>
              </div>

              {/* Social */}
              <div className='bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 text-center md:col-span-2 lg:col-span-1'>
                <div className='bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                  <Globe className='w-8 h-8 text-purple-600' />
                </div>
                <h3
                  className='text-lg font-semibold mb-2'
                  style={{ color: 'var(--text-primary)' }}
                >
                  Social Media
                </h3>
                <p className='mb-4' style={{ color: 'var(--text-secondary)' }}>
                  Follow my journey
                </p>
                <div className='flex justify-center space-x-4'>
                  <a
                    href='https://github.com/adrian'
                    className='transition-colors duration-200'
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = 'var(--text-primary)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = 'var(--text-secondary)')
                    }
                    aria-label='GitHub Profile'
                  >
                    GitHub
                  </a>
                  <a
                    href='https://linkedin.com/in/adrian'
                    className='transition-colors duration-200'
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = 'var(--text-primary)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = 'var(--text-secondary)')
                    }
                    aria-label='LinkedIn Profile'
                  >
                    LinkedIn
                  </a>
                  <a
                    href='https://x.com/adrian'
                    className='transition-colors duration-200'
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = 'var(--text-primary)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = 'var(--text-secondary)')
                    }
                    aria-label='X Profile'
                  >
                    X
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
