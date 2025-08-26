import {
  Mail,
  Calendar,
  Code,
  Database,
  Globe,
  Smartphone,
  Users,
  Award,
  ExternalLink,
  Layers,
  Server,
  Network,
  Terminal,
  Monitor,
  Cloud,
  Shield,
  Sprout,
  TreePine,
} from 'lucide-react';
import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO';
import ContactCard from '@/components/about/ContactCard';
import SocialLinks from '@/components/about/SocialLinks';
import BreadcrumbStructuredData from '@/components/seo/BreadcrumbStructuredData';

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
  // Generate breadcrumbs for the about page
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
  ];

  const skills = [
    { 
      name: 'Backend', 
      level: 95, 
      icon: Database, 
      color: '#2563eb', // blue-600
      techStack: ['Java (17+)', 'Spring Boot', 'Spring WebFlux', 'Spring Security', 'Node.js', 'Express.js']
    },
    { 
      name: 'Architecture & Design Patterns', 
      level: 90, 
      icon: Layers, 
      color: '#4f46e5', // indigo-600
      techStack: ['Microservices', 'Clean Architecture', 'SOLID', 'Design Patterns']
    },
    {
      name: 'API & Integration',
      level: 90,
      icon: Network,
      color: '#0d9488', // teal-600
      techStack: ['RESTful API design', 'External API integration', 'Java HttpClient']
    },
    {
      name: 'Data & Persistence',
      level: 90,
      icon: Server,
      color: '#16a34a', // green-600
      techStack: ['Redis', 'Gson', 'Jackson', 'Spring Data JPA']
    },
    {
      name: 'CLI & utilities',
      level: 85,
      icon: Terminal,
      color: '#9333ea', // purple-600
      techStack: ['Apache Commons CLI', 'OpenCSV', 'SLF4J', 'Bucket4j']
    },
    {
      name: 'Frontend & Web',
      level: 80,
      icon: Monitor,
      color: '#ea580c', // orange-600
      techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3']
    },
    {
      name: 'DevOps & Deployment',
      level: 80,
      icon: Cloud,
      color: '#dc2626', // red-600
      techStack: ['Docker', 'Vercel', 'Maven', 'Production deployment']
    },
    {
      name: 'Testing & Quality',
      level: 75,
      icon: Shield,
      color: '#ca8a04', // yellow-600
      techStack: ['JUnit 5', 'Mockito', 'Jest', 'Supertest']
    },
  ];

  const experiences = [
    {
      title: 'Intern – Software Architecture',
      company: 'Sociedad Estatal Correos y Telégrafos, S.A., S.M.E.',
      period: '2025 - Present',
      description:
        'Currently interning in the Software Architecture department, gaining hands-on experience in designing and optimizing enterprise-level software systems. Applying best practices in architecture, development, and project management.',
      achievements: [
        'Contributed to software architecture design and system optimization',
        'Applied knowledge of backend development and programming best practices',
        'Gained experience in real-world enterprise software projects',
      ],
    },
    {
      title: 'Backend Development',
      company: 'Independent Projects',
      period: '2024 - Present',
      description:
        'Working on self-driven backend development projects, designing and building robust and efficient systems. Exploring best practices in software architecture, APIs, and data management.',
      achievements: [
        'Developed scalable backend services and APIs',
        'Applied modern frameworks and technologies (Java, Spring, Node.js)',
        'Strengthened skills in system architecture, data handling, and performance optimization',
      ],
    },
    {
      title: 'Computer Engineering',
      company: 'Rey Juan Carlos University',
      period: '2023 - Present',
      description:
        'Currently pursuing a degree in Computer Engineering, developing a solid foundation in both software and hardware. Learning to optimize systems and understand how software and electronics work together.',
      achievements: [
        'Programming: C, Java, Assembly, Bash',
        'Hardware & Electronics: VHDL, digital logic, embedded systems',
        'Strengthening understanding of software-hardware integration and system optimization',
        'Received honor mention in some subjects',
      ],
    },
    {
      title: 'Pentesting / Ethical Hacking',
      company: '',
      period: '2022 - 2024',
      description:
        'Started my journey in penetration testing, focusing on cybersecurity challenges and hands-on ethical hacking. Achieved recognition in the Hack The Box community and obtained relevant certifications.',
      achievements: [
        'Ranked in the top 100 on Hack The Box machines worldwide',
        'Earned certifications in penetration testing',
        'Developed practical skills in vulnerability assessment, exploitation, and security analysis',
      ],
    },
    {
      title: 'Cabin Crew',
      company: 'Malta Air',
      period: '2022 - 2023',
      description:
        'Started working as cabin crew, providing excellent customer service and ensuring passenger safety. Adapted to a fast-paced, international environment while developing communication and teamwork skills.',
      achievements: [
        'Gained experience in high-pressure, customer-focused settings',
        'Strengthened interpersonal and problem-solving skills',
        'Managed travel and time efficiently across international routes',
      ],
    },
    {
      title: 'Double Degree in Financial Economics and Economics',
      company: 'Rey Juan Carlos University',
      period: '2020 - 2022',
      description:
        'Joined the degree to deepen my knowledge in investments, resource management, time optimization, and business. Gained a solid foundation in economic theory, financial markets, and quantitative analysis.',
      achievements: [
        'Explored investments, corporate finance, and resource allocation',
        'Developed skills in risk assessment and decision-making',
        'Strengthened understanding of broader economic concepts',
      ],
    },
  ];

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className='min-h-screen bg-background'>
        {/* Hero Section - Personal Introduction */}
        <section
          className='relative py-12 sm:py-20 lg:py-32'
          style={{
            background: `linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-to))`,
          }}
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center'>
              {/* Text Content */}
              <div className='text-center lg:text-left'>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6'>
                  Hi, I&apos;m{' '}
                  <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Adrián Feito Blázquez
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
            I started in pentesting, reaching top 100 on some Hack The Box machines worldwide, before transitioning to backend development. Currently, I study Computer Engineering and intern in Software Architecture, focusing on scalable systems and proper design patterns while constantly exploring new technologies and paying close attention to every detail.
          </p>
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center lg:justify-start'>
                  <Link
                    href='/blog'
                    className='inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-500 group'
                  >
                    <Code className='w-5 h-5 mr-2 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
                    <span className='group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500'>
                      View My Work
                    </span>
                    <ExternalLink className='w-4 h-4 ml-2 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
                  </Link>
                  <a
                    href='#contact'
                    className='inline-flex items-center px-6 py-3 border-2 border-border hover:border-primary text-foreground hover:text-primary font-medium rounded-lg transition-colors duration-500 group'
                  >
                    <Mail className='w-5 h-5 mr-2 text-muted-foreground group-hover:text-primary transition-colors duration-500' />
                    Get In Touch
                  </a>
                </div>
              </div>

              {/* Profile Image Placeholder */}
              <div className='flex justify-center lg:justify-end'>
                <div className='relative'>
                  <img
                    src='/images/hero-image.jpg'
                    alt='Adrián Feito Blázquez - Computer Engineer and Software Developer'
                    className='w-80 h-80 rounded-full object-cover shadow-2xl'
                  />
                  <div className='absolute -bottom-4 -right-4 bg-background border border-border rounded-full p-4 shadow-lg'>
                    <Code className='w-8 h-8 text-blue-600' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programming Philosophy Section */}
        <section className='py-16 sm:py-20 bg-background relative overflow-hidden'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center'>
              <div className='relative inline-block'>
                {/* Background decoration */}
                <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl transform rotate-1'></div>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl transform -rotate-1'></div>
                
                {/* Main content */}
                <div className='relative bg-card border border-border rounded-2xl p-8 sm:p-12 shadow-lg'>
                  <div className='flex items-center justify-center mb-6'>
                    <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3'>
                      <Code className='w-8 h-8 text-white' />
                    </div>
                  </div>
                  
                  <h2 className='text-2xl sm:text-3xl font-bold mb-6' style={{ color: 'var(--text-primary)' }}>
                    My Programming Philosophy
                  </h2>
                  
                  {/* Code block styling */}
                  <div className='bg-slate-900 dark:bg-slate-800 rounded-lg p-6 sm:p-8 mb-6 font-mono text-left max-w-md mx-auto border border-slate-700'>
                    <div className='flex items-center mb-4'>
                      <div className='flex space-x-2'>
                        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                        <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      </div>
                      <span className='ml-4 text-slate-400 text-sm'>philosophy.js</span>
                    </div>
                    <div className='text-green-400 text-lg sm:text-xl'>
                      <span className='text-purple-400'>while</span> <span className='text-white'>(</span><span className='text-blue-400'>age</span><span className='text-red-400'>++</span><span className='text-white'>)</span> <span className='text-white'>&#123;</span>
                      <br />
                      <span className='ml-4 text-blue-400'>knowledge</span><span className='text-red-400'>++</span><span className='text-white'>;</span>
                      <br />
                      <span className='text-white'>&#125;</span>
                    </div>
                  </div>
                  
                  <p className='text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed' style={{ color: 'var(--text-secondary)' }}>
                    Every year brings new challenges, technologies, and opportunities to grow. 
                    I believe in continuous learning and improvement, where each experience adds to my expertise 
                    and every project teaches me something valuable.
                  </p>
                  
                  <div className='mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium'>
                    <span className='inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full'>
                      <Terminal className='w-4 h-4 mr-2' />
                      Continuous Learning
                    </span>
                    <span className='inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full'>
                      <Code className='w-4 h-4 mr-2' />
                      Growth Mindset
                    </span>
                    <span className='inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full'>
                      <Award className='w-4 h-4 mr-2' />
                      Never Stop Improving
                    </span>
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
                technologies and best practices in software engineering.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
              {skills.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <div
                    key={index}
                    className='bg-card rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-500'
                  >
                    <div className='flex items-center mb-3 sm:mb-4'>
                      <div
                        className='p-2 sm:p-3 rounded-lg mr-3 sm:mr-4'
                        style={{ backgroundColor: skill.color }}
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
                              className='h-2 rounded-full transition-all duration-1000 ease-out'
                              style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
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
                    
                    {/* Tech Stack Tags */}
                    <div className='flex flex-wrap gap-1.5 sm:gap-2 mt-3'>
                      {skill.techStack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 transition-all duration-200 rounded-full px-4'
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Professional Background Section */}
        <section className='py-20 bg-muted/30'>
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
                My journey in software engineering has been filled with exciting
                challenges and continuous learning.
              </p>
            </div>

            <div className='relative'>
              {/* Timeline line - only extends from tree icon to plant icon */}
              <div className='absolute left-4 md:left-1/2 transform md:-translate-x-px w-0.5 bg-border' style={{top: '60px', bottom: '60px'}}></div>

              {/* Career Growth - Tree at Top */}
              <div className='relative flex flex-col items-center mb-8'>
                <div className='text-center mb-4'>
                  <p className='text-sm font-medium text-green-600'>Current Growth</p>
                </div>
                <div className='w-12 h-12 bg-green-600 rounded-full border-4 border-background z-10 flex items-center justify-center'>
                  <TreePine className='w-6 h-6 text-white' />
                </div>
              </div>

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
                    <div className='bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-500'>
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

              {/* Career Growth - Seed at Bottom */}
              <div className='relative flex flex-col items-center mt-8'>
                <div className='w-12 h-12 bg-blue-600 rounded-full border-4 border-background z-10 flex items-center justify-center'>
                  <Sprout className='w-6 h-6 text-white' />
                </div>
                <div className='text-center mt-4'>
                  <p className='text-sm font-medium text-blue-600'>The Beginning</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section
          id='contact'
          className='py-12 sm:py-16 lg:py-20'
          style={{
            background: `linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-to))`,
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
              <ContactCard
                iconName='mail'
                title='Email'
                description="Let's discuss your project"
                content='adrian@example.com'
                href='mailto:adrian@example.com'
                iconBgColor='bg-blue-100 dark:bg-blue-900/20'
                iconColor='text-blue-600'
                isLink={true}
              />

              {/* Location */}
              <ContactCard
                iconName='mapPin'
                title='Location'
                description='Available for remote work'
                content='San Francisco, CA'
                iconBgColor='bg-green-100 dark:bg-green-900/20'
                iconColor='text-green-600'
                isLink={false}
              />

              {/* Social */}
              <ContactCard
                iconName='globe'
                title='Social Media'
                description='Follow my journey'
                content=''
                iconBgColor='bg-purple-100 dark:bg-purple-900/20'
                iconColor='text-purple-600'
                isLink={false}
              >
                <SocialLinks
                  links={[
                    {
                      href: 'https://github.com/adrian',
                      label: 'GitHub',
                      ariaLabel: 'GitHub Profile',
                    },
                    {
                      href: 'https://linkedin.com/in/adrian',
                      label: 'LinkedIn',
                      ariaLabel: 'LinkedIn Profile',
                    },
                    {
                      href: 'https://x.com/adrian',
                      label: 'X',
                      ariaLabel: 'X Profile',
                    },
                  ]}
                />
              </ContactCard>
            </div>

            {/* Call to Action */}
            <div className='text-center mt-12'>
              <Link
                href='/blog'
                className='inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-500 group'
              >
                <Code className='w-5 h-5 mr-2 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
                <span className='group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500'>
                  Check Out My Blog
                </span>
                <ExternalLink className='w-4 h-4 ml-2 group-hover:!text-slate-900 dark:group-hover:text-[var(--hero-gradient-from)] transition-colors duration-500' />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
