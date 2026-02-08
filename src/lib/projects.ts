import { Project, ProjectSummary, ProjectFilters, ProjectSortOptions } from '@/types/project';

/**
 * Static project data based on the existing projects page
 */
const projects: Project[] = [
  {
    id: 'hpc-systems-lab',
    title: 'HPC & Systems Lab',
    description: 'Performance-critical C++ repository featuring SIMD vectorization, memory optimization benchmarks, and parallel algorithms (OpenMP/MPI) adhering to Google Style Guide.',
    date: '2026-02-08',
    technologies: ['C++20', 'CMake', 'MPI', 'OpenMP'],
    githubUrl: 'https://github.com/Shockp/HPC-Learning',
    category: 'systems',
    status: 'completed',
    featured: true
  },
  {
    id: 'smart-cane',
    title: 'SmartCane',
    description: 'Assistive technology device for the visually impaired using IoT sensors and real-time obstacle detection algorithms.',
    date: '2025-12-05',
    technologies: ['C++', 'Arduino/ESP32', 'IoT Sensors', 'Hardware Design'],
    githubUrl: 'https://github.com/Shockp/SmartCane',
    category: 'embedded',
    status: 'completed',
    featured: true
  },
  {
    id: 'personal-blog',
    title: 'Personal Blog',
    description: 'Next.js personal blog and portfolio website with React, TypeScript, Tailwind CSS, and responsive design',
    date: '2025-08-10',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Shockp/personal-blog',
    category: 'web',
    status: 'completed',
    featured: true
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Full-stack web application with Node.js/Express backend and responsive frontend for unit conversions',
    date: '2025-07-25',
    technologies: ['Node.js', 'Express', 'Full-stack'],
    githubUrl: 'https://github.com/Shockp/Backend-Projects/tree/main/unit-converter',
    category: 'web',
    status: 'completed'
  },
  {
    id: 'weather-api-wrapper',
    title: 'Weather API Wrapper Service',
    description: 'Spring Boot microservice with Redis caching, rate limiting, and Visual Crossing API integration',
    date: '2025-07-15',
    technologies: ['Spring Boot', 'Redis', 'API'],
    githubUrl: 'https://github.com/Shockp/Backend-Projects/tree/main/weather-api-wrapper-service',
    category: 'api',
    status: 'completed'
  },
  {
    id: 'number-guessing-game',
    title: 'Number Guessing Game',
    description: 'Java CLI game with hexagonal architecture, multiple difficulty levels, and player management',
    date: '2025-07-05',
    technologies: ['Java', 'Game', 'Architecture'],
    githubUrl: 'https://github.com/Shockp/Backend-Projects/tree/main/number-guessing-game',
    category: 'game',
    status: 'completed'
  },
  {
    id: 'github-user-activity',
    title: 'GitHub User Activity',
    description: 'Java CLI tool that fetches and displays recent GitHub activity using REST API',
    date: '2025-06-28',
    technologies: ['Java', 'REST API', 'CLI'],
    githubUrl: 'https://github.com/Shockp/Backend-Projects/tree/main/github-user-activity',
    category: 'cli',
    status: 'completed'
  },
  {
    id: 'expense-tracker',
    title: 'Expense Tracker',
    description: 'Java CLI application for personal finance management with Maven, JSON storage, and CSV export',
    date: '2025-06-20',
    technologies: ['Java', 'Maven', 'CLI'],
    githubUrl: 'https://github.com/Shockp/Backend-Projects/tree/main/expense-tracker',
    category: 'cli',
    status: 'completed'
  },
  {
    id: 'mini-shell',
    title: 'Mini Shell',
    description: 'Implementation of a Unix-like shell interpreter with pipes and redirection support',
    date: '2025-06-09',
    technologies: ['C', 'Shell', 'Unix'],
    githubUrl: 'https://github.com/Shockp/Mini-Shell',
    category: 'cli',
    status: 'completed'
  },
  {
    id: 'personal-website',
    title: 'Personal Website',
    description: 'GitHub Pages hosted personal portfolio and blog website',
    date: '2025-06-06',
    technologies: ['HTML', 'CSS', 'Website'],
    githubUrl: 'https://github.com/Shockp/shockp.github.io',
    category: 'web',
    status: 'completed'
  },
  {
    id: 'python-projects',
    title: 'Python Projects',
    description: 'Repository with various Python programming projects and scripts',
    date: '2024-12-23',
    technologies: ['Python', 'Programming', 'Scripts'],
    githubUrl: 'https://github.com/Shockp/Python-Projects',
    category: 'cli',
    status: 'completed'
  },
  {
    id: 'ai-ml-projects',
    title: 'AI & ML Projects',
    description: 'Collection of artificial intelligence and machine learning projects and experiments',
    date: '2024-12-19',
    technologies: ['Python', 'AI', 'Machine Learning'],
    githubUrl: 'https://github.com/Shockp/AI-ML-Projects',
    category: 'ai',
    status: 'completed'
  },
  {
    id: 'cve-exploits-htb',
    title: 'CVE Exploits and HackTheBox Writeups',
    description: 'Detailed writeups and exploit code for CVE vulnerabilities and HackTheBox challenges',
    date: '2023-05-24',
    technologies: ['Security', 'CVE', 'HackTheBox'],
    githubUrl: 'https://github.com/Shockp/CVE-Exploits-and-HackTheBox-Writeups',
    category: 'security',
    status: 'completed'
  },
  {
    id: 'pentesting-scripts',
    title: 'Pentesting Scripts',
    description: 'Collection of Python scripts for penetration testing and security assessments',
    date: '2023-05-16',
    technologies: ['Python', 'Security', 'Pentesting'],
    githubUrl: 'https://github.com/Shockp/Pentesting-Scripts',
    category: 'security',
    status: 'completed'
  },
  {
    id: 'pentesting-cheatsheets',
    title: 'Pentesting Cheatsheets',
    description: 'Comprehensive collection of penetration testing cheatsheets and reference materials',
    date: '2022-03-15',
    technologies: ['Security', 'Pentesting', 'Cheatsheets'],
    githubUrl: 'https://github.com/Shockp/Pentesting-Cheatsheets',
    category: 'security',
    status: 'completed'
  }
];

/**
 * Get all projects
 */
export function getAllProjects(): Project[] {
  return projects;
}

/**
 * Get recent projects (sorted by date, most recent first)
 */
export function getRecentProjects(limit: number = 3): Project[] {
  return projects
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Get featured projects
 */
export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured);
}

/**
 * Get project by ID
 */
export function getProjectById(id: string): Project | undefined {
  return projects.find(project => project.id === id);
}

/**
 * Get projects by category
 */
export function getProjectsByCategory(category: string): Project[] {
  return projects.filter(project => project.category === category);
}

/**
 * Get projects by technology
 */
export function getProjectsByTechnology(technology: string): Project[] {
  return projects.filter(project =>
    project.technologies.some(tech =>
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
}

/**
 * Filter projects based on criteria
 */
export function filterProjects(filters: ProjectFilters): Project[] {
  let filteredProjects = projects;

  if (filters.category) {
    filteredProjects = filteredProjects.filter(project => project.category === filters.category);
  }

  if (filters.technology) {
    filteredProjects = filteredProjects.filter(project =>
      project.technologies.some(tech =>
        tech.toLowerCase().includes(filters.technology!.toLowerCase())
      )
    );
  }

  if (filters.status) {
    filteredProjects = filteredProjects.filter(project => project.status === filters.status);
  }

  if (filters.featured !== undefined) {
    filteredProjects = filteredProjects.filter(project => project.featured === filters.featured);
  }

  return filteredProjects;
}

/**
 * Sort projects based on criteria
 */
export function sortProjects(projects: Project[], options: ProjectSortOptions): Project[] {
  const { sortBy, order } = options;

  return [...projects].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'category':
        comparison = (a.category || '').localeCompare(b.category || '');
        break;
      default:
        return 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });
}

/**
 * Get project summaries (for card displays)
 */
export function getProjectSummaries(limit?: number): ProjectSummary[] {
  const projectSummaries = projects.map(project => ({
    ...project,
    excerpt: project.description.length > 100
      ? project.description.substring(0, 100) + '...'
      : project.description
  }));

  return limit ? projectSummaries.slice(0, limit) : projectSummaries;
}

/**
 * Get unique categories from all projects
 */
export function getProjectCategories(): string[] {
  const categories = projects
    .map(project => project.category)
    .filter((category): category is string => category !== undefined);

  return [...new Set(categories)].sort();
}

/**
 * Get unique technologies from all projects
 */
export function getProjectTechnologies(): string[] {
  const technologies = projects
    .flatMap(project => project.technologies);

  return [...new Set(technologies)].sort();
}