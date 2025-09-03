/**
 * Project-related type definitions
 */

export interface Project {
  /** Unique identifier for the project */
  id: string;
  /** Project title */
  title: string;
  /** Project description */
  description: string;
  /** Project creation/last update date */
  date: string;
  /** Array of technologies used in the project */
  technologies: string[];
  /** GitHub repository URL */
  githubUrl: string;
  /** Optional live demo URL */
  demoUrl?: string;
  /** Project category (e.g., 'web', 'cli', 'api', 'game') */
  category?: string;
  /** Project status (e.g., 'completed', 'in-progress', 'archived') */
  status?: 'completed' | 'in-progress' | 'archived';
  /** Featured project flag */
  featured?: boolean;
}

/**
 * Project summary interface for card displays
 */
export interface ProjectSummary extends Omit<Project, 'content'> {
  /** Short excerpt for preview */
  excerpt?: string;
}

/**
 * Project filter options
 */
export interface ProjectFilters {
  /** Filter by category */
  category?: string;
  /** Filter by technology */
  technology?: string;
  /** Filter by status */
  status?: Project['status'];
  /** Show only featured projects */
  featured?: boolean;
}

/**
 * Project sorting options
 */
export type ProjectSortBy = 'date' | 'title' | 'category';
export type ProjectSortOrder = 'asc' | 'desc';

export interface ProjectSortOptions {
  sortBy: ProjectSortBy;
  order: ProjectSortOrder;
}