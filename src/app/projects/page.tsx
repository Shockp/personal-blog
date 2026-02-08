import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my projects and work',
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--card-text)' }}>
        Projects
      </h1>
      <p className="mb-8" style={{ color: 'var(--card-text-secondary)' }}>
        Here are some of the projects I&apos;ve worked on. Each project showcases different technologies and approaches to solving problems.
      </p>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          href="https://github.com/Shockp/personal-blog"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2025-08-10' className='font-medium'>Aug 10, 2025</time>
              </div>
              <span className="category-tag category-web">web</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              Personal Blog
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Next.js personal blog and portfolio website with React, TypeScript, Tailwind CSS, and responsive design
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span className="tech-tag tech-nextjs">
                Next.js
              </span>
              <span className="tech-tag tech-react">
                React
              </span>
              <span className="tech-tag tech-typescript">
                TypeScript
              </span>
              <span className="tech-tag tech-tailwind">
                Tailwind CSS
              </span>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/Shockp/Backend-Projects/tree/main/unit-converter"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2025-07-25' className='font-medium'>Jul 25, 2025</time>
              </div>
              <span className="category-tag category-backend">backend</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              Unit Converter
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Full-stack web application with Node.js/Express backend and responsive frontend for unit conversions
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span className="tech-tag tech-nodejs">
                Node.js
              </span>
              <span className="tech-tag tech-express">
                Express
              </span>
              <span className="tech-tag tech-fullstack">
                Full-stack
              </span>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/Shockp/Backend-Projects/tree/main/weather-api-wrapper-service"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2025-07-15' className='font-medium'>Jul 15, 2025</time>
              </div>
              <span className="category-tag category-api">api</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              Weather API Wrapper Service
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Spring Boot microservice with Redis caching, rate limiting, and Visual Crossing API integration
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span className="tech-tag tech-spring">
                Spring Boot
              </span>
              <span className="tech-tag tech-redis">
                Redis
              </span>
              <span className="tech-tag tech-api">
                API
              </span>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/Shockp/Backend-Projects/tree/main/number-guessing-game"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2025-07-05' className='font-medium'>Jul 5, 2025</time>
              </div>
              <span className="category-tag category-game">game</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              Number Guessing Game
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Java CLI game with hexagonal architecture, multiple difficulty levels, and player management
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span className="tech-tag tech-java">
                Java
              </span>
              <span className="tech-tag tech-game">
                Game
              </span>
              <span className="tech-tag tech-architecture">
                Architecture
              </span>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/Shockp/Backend-Projects/tree/main/github-user-activity"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2025-06-28' className='font-medium'>Jun 28, 2025</time>
              </div>
              <span className="category-tag category-tool">tool</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              GitHub User Activity
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Java CLI tool that fetches and displays recent GitHub activity using REST API
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span className="tech-tag tech-java">
                Java
              </span>
              <span className="tech-tag tech-restapi">
                REST API
              </span>
              <span className="tech-tag tech-cli">
                CLI
              </span>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/Shockp/Backend-Projects/tree/main/expense-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2025-06-20' className='font-medium'>Jun 20, 2025</time>
              </div>
              <span className="category-tag category-finance">finance</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              Expense Tracker
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Java CLI application for personal finance management with Maven, JSON storage, and CSV export
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
                style={{ backgroundColor: 'rgba(245, 101, 101, 0.2)', color: '#f56565', border: '1px solid rgba(245, 101, 101, 0.3)' }}
              >
                Java
              </span>
              <span className="tech-tag tech-maven">
                Maven
              </span>
              <span className="tech-tag tech-cli">
                CLI
              </span>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/Shockp/Mini-Shell"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2025-06-09' className='font-medium'>Jun 9, 2025</time>
              </div>
              <span className="category-tag category-system">system</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              Mini Shell
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Implementation of a Unix-like shell interpreter with pipes and redirection support
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span className="tech-tag tech-c">
                C
              </span>
              <span className="tech-tag tech-shell">
                Shell
              </span>
              <span className="tech-tag tech-unix">
                Unix
              </span>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/Shockp/CVE-Exploits-and-HackTheBox-Writeups"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2023-05-24' className='font-medium'>May 24, 2023</time>
              </div>
              <span className="category-tag category-security">security</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              CVE Exploits and HackTheBox Writeups
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Detailed writeups and exploit code for CVE vulnerabilities and HackTheBox challenges
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span className="tech-tag tech-security">
                Security
              </span>
              <span className="tech-tag tech-cve">
                CVE
              </span>
              <span className="tech-tag tech-hackthebox">
                HackTheBox
              </span>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/Shockp/Pentesting-Scripts"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2023-05-16' className='font-medium'>May 16, 2023</time>
              </div>
              <span className="category-tag category-security">security</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              Pentesting Scripts
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Collection of Python scripts for penetration testing and security assessments
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span className="tech-tag tech-python">
                Python
              </span>
              <span className="tech-tag tech-security">
                Security
              </span>
              <span className="tech-tag tech-pentesting">
                Pentesting
              </span>
            </div>
          </div>
        </a>

        <a
          href="https://github.com/Shockp/Pentesting-Cheatsheets"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm mb-3" style={{ color: 'var(--card-text-secondary)' }}>
              <div className='flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-calendar w-4 h-4' aria-hidden='true'>
                  <path d='M8 2v4'></path>
                  <path d='M16 2v4'></path>
                  <rect width='18' height='18' x='3' y='4' rx='2'></rect>
                  <path d='M3 10h18'></path>
                </svg>
                <time dateTime='2022-03-15' className='font-medium'>Mar 15, 2022</time>
              </div>
              <span className="category-tag category-reference">reference</span>
            </div>
            <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
              Pentesting Cheatsheets
            </h3>
            <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
              Comprehensive collection of penetration testing cheatsheets and reference materials
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                Security
              </span>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
                style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' }}
              >
                Pentesting
              </span>
              <span className="tech-tag tech-cheatsheets">
                Cheatsheets
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}