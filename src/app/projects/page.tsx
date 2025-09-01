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
        Here are some of the projects I've worked on. Each project showcases different technologies and approaches to solving problems.
      </p>
      
      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)]"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            E-Commerce Platform
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--card-text-secondary)' }}>
            A full-stack e-commerce solution built with modern technologies, featuring user authentication, payment processing, and inventory management.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}
            >
              react
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)' }}
            >
              typescript
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}
            >
              node.js
            </span>
          </div>
        </article>

        <article 
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)]"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            Task Management App
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--card-text-secondary)' }}>
            A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#22c55e', border: '1px solid rgba(74, 222, 128, 0.2)' }}
            >
              vue.js
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}
            >
              firebase
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.2)' }}
            >
              tailwind
            </span>
          </div>
        </article>

        <article 
          className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer hover:shadow-[var(--card-hover-shadow)]"
          style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <h3 className="text-xl font-bold mb-3 transition-colors duration-500" style={{ color: 'var(--card-text)' }}>
            Data Visualization Dashboard
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--card-text-secondary)' }}>
            An interactive dashboard for visualizing complex datasets with charts, graphs, and real-time data updates for business intelligence.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              d3.js
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.2)' }}
            >
              python
            </span>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 min-h-[24px]"
              style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.2)' }}
            >
              flask
            </span>
          </div>
        </article>
      </div>
    </div>
  );
}