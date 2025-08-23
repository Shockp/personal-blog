/**
 * Types for JSON-LD structured data schemas
 */

export interface Person {
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string;
  sameAs?: string[];
  jobTitle?: string;
  worksFor?: Organization;
}

export interface Organization {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export interface Article {
  '@type': 'Article';
  headline: string;
  description: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author: Person;
  publisher?: Organization;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  url: string;
  wordCount?: number;
  keywords?: string[];
  articleSection?: string;
}

export interface BlogPosting extends Omit<Article, '@type'> {
  '@type': 'BlogPosting';
}

export interface BreadcrumbList {
  '@type': 'BreadcrumbList';
  itemListElement: ListItem[];
}

export interface ListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface WebSite {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: Organization;
  potentialAction?: SearchAction;
}

export interface SearchAction {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}

export interface StructuredData {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: any;
}

export type StructuredDataType = 
  | Article 
  | BlogPosting 
  | Person 
  | Organization 
  | BreadcrumbList 
  | WebSite;