'use client';

import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

/**
 * Props for the markdown renderer
 */
interface MarkdownRendererProps {
  /** The markdown content to render */
  content: string;
  /** Custom components for markdown rendering */
  components: Components;
  /** The sanitized content */
  sanitizedContent: string;
}

/**
 * Heavy markdown renderer component
 * Contains all the heavy markdown processing libraries
 * This component is lazy-loaded to reduce initial bundle size
 */
export function MarkdownRenderer({
  components,
  sanitizedContent,
}: MarkdownRendererProps) {
  return (
    <article className='prose prose-lg dark:prose-invert max-w-none'>
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </article>
  );
}

export default MarkdownRenderer;
