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
          href="https://github.com/Shockp/Pentesting-scripts"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="absolute top-4 right-4 text-xs" style={{ color: 'var(--card-text-secondary)' }}>
            May 16, 2023
          </div>
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            Pentesting Scripts
          </h3>
          <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
            Collection of useful penetration testing scripts and automation tools
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)' }}
            >
              Python
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' }}
            >
              Bash
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.3)' }}
            >
              PowerShell
            </span>
          </div>
        </a>

        <a 
          href="https://github.com/Shockp/Pentesting-Cheatsheets"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="absolute top-4 right-4 text-xs" style={{ color: 'var(--card-text-secondary)' }}>
            Jan 4, 2020
          </div>
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            Pentesting Cheatsheets
          </h3>
          <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
            Comprehensive cheatsheets and reference guides for penetration testing
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}
            >
              Documentation
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
            >
              Reference
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              Security
            </span>
          </div>
        </a>

        <a 
          href="https://github.com/Shockp/CVE-Exploits"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="absolute top-4 right-4 text-xs" style={{ color: 'var(--card-text-secondary)' }}>
            May 24, 2023
          </div>
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            CVE Exploits
          </h3>
          <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
            Collection of CVE exploits and proof-of-concept code
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(220, 38, 127, 0.2)', color: '#dc2626', border: '1px solid rgba(220, 38, 127, 0.3)' }}
            >
              Exploits
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(245, 101, 101, 0.2)', color: '#f56565', border: '1px solid rgba(245, 101, 101, 0.3)' }}
            >
              CVE
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              Security
            </span>
          </div>
        </a>

        <a 
          href="https://github.com/Shockp/HackTheBox-Writeups"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="absolute top-4 right-4 text-xs" style={{ color: 'var(--card-text-secondary)' }}>
            May 24, 2023
          </div>
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            HackTheBox Writeups
          </h3>
          <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
            Collection of detailed writeups and solutions for HackTheBox challenges
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' }}
            >
              CTF
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}
            >
              Writeups
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              Security
            </span>
          </div>
        </a>

        <a 
          href="https://github.com/Shockp/AI-ML"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="absolute top-4 right-4 text-xs" style={{ color: 'var(--card-text-secondary)' }}>
            Dec 19, 2024
          </div>
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            AI & Machine Learning
          </h3>
          <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
            Artificial Intelligence and Machine Learning projects and experiments
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)' }}
            >
              Python
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
            >
              AI
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              ML
            </span>
          </div>
        </a>

        <a 
          href="https://github.com/Shockp/Python-Projects"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="absolute top-4 right-4 text-xs" style={{ color: 'var(--card-text-secondary)' }}>
            Dec 23, 2024
          </div>
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            Python Projects
          </h3>
          <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
            Repository with various Python programming projects and scripts
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)' }}
            >
              Python
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.3)' }}
            >
              Programming
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' }}
            >
              Scripts
            </span>
          </div>
        </a>

        <a 
          href="https://github.com/Shockp/Mini-Shell"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="absolute top-4 right-4 text-xs" style={{ color: 'var(--card-text-secondary)' }}>
            Jun 9, 2025
          </div>
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            Mini Shell
          </h3>
          <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
            Implementation of a Unix-like shell interpreter with pipes and redirection support
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(245, 101, 101, 0.2)', color: '#f56565', border: '1px solid rgba(245, 101, 101, 0.3)' }}
            >
              C
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}
            >
              Shell
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' }}
            >
              Unix
            </span>
          </div>
        </a>

        <a 
          href="https://github.com/Shockp/shockp.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)] flex flex-col h-full block relative"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="absolute top-4 right-4 text-xs" style={{ color: 'var(--card-text-secondary)' }}>
            Jun 6, 2025
          </div>
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            Personal Website
          </h3>
          <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--card-text-secondary)' }}>
            GitHub Pages hosted personal portfolio and blog website
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.3)' }}
            >
              HTML
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
            >
              CSS
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              Website
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}