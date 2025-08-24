import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { getAllPosts, getPostBySlug } from '../posts';
import { BlogPostSummary, BlogPost } from '@/types/blog';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock path module
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}));

// Mock markdown module
jest.mock('../markdown', () => ({
  parseFrontmatter: jest.fn(),
  markdownToHtml: jest.fn(),
}));

// Mock validation module
jest.mock('../validation', () => ({
  validateBlogPost: jest.fn(),
  formatValidationErrors: jest.fn(),
}));

import { parseFrontmatter, markdownToHtml } from '../markdown';
import { validateBlogPost, formatValidationErrors } from '../validation';

const mockParseFrontmatter = parseFrontmatter as jest.MockedFunction<typeof parseFrontmatter>;
const mockMarkdownToHtml = markdownToHtml as jest.MockedFunction<typeof markdownToHtml>;
const mockValidateBlogPost = validateBlogPost as jest.MockedFunction<typeof validateBlogPost>;
const mockFormatValidationErrors = formatValidationErrors as jest.MockedFunction<typeof formatValidationErrors>;

describe('Posts Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockValidateBlogPost.mockReturnValue({
      isValid: true,
      errors: [],
      warnings: [],
    });
    
    mockFormatValidationErrors.mockReturnValue('Validation error');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllPosts', () => {
    it('should return empty array when posts directory does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = await getAllPosts();
      
      expect(result).toEqual([]);
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.stringContaining('content/posts'));
    });

    it('should return empty array when no markdown files exist', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['README.txt', 'image.jpg'] as any);
      
      const result = await getAllPosts();
      
      expect(result).toEqual([]);
    });

    it('should process valid markdown files', async () => {
      const mockFiles = ['post1.md', 'post2.mdx', 'not-markdown.txt'];
      const mockFileContent = `---
title: "Test Post"
description: "Test description"
date: "2024-01-15"
---

Test content`;
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(mockFiles as any);
      mockFs.readFileSync.mockReturnValue(mockFileContent);
      
      mockParseFrontmatter.mockReturnValue({
        data: {
          title: 'Test Post',
          description: 'Test description',
          date: '2024-01-15',
          tags: ['test'],
          author: 'Test Author',
          published: true,
        },
        content: 'Test content with multiple words to calculate reading time properly',
      });
      
      const result = await getAllPosts();
      
      expect(result).toHaveLength(2); // Only .md and .mdx files
      expect(result[0]).toMatchObject({
        slug: 'post1',
        title: 'Test Post',
        description: 'Test description',
        date: '2024-01-15',
        tags: ['test'],
        author: 'Test Author',
        published: true,
        readingTime: expect.any(Number),
        wordCount: expect.any(Number),
      });
    });

    it('should sort posts by date (newest first)', async () => {
      const mockFiles = ['old-post.md', 'new-post.md'];
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(mockFiles as any);
      
      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Old Post"
description: "Old description"
date: "2024-01-01"
---
Old content`)
        .mockReturnValueOnce(`---
title: "New Post"
description: "New description"
date: "2024-01-15"
---
New content`);
      
      mockParseFrontmatter
        .mockReturnValueOnce({
          data: {
            title: 'Old Post',
            description: 'Old description',
            date: '2024-01-01',
            tags: [],
            author: 'Author',
            published: true,
          },
          content: 'Old content',
        })
        .mockReturnValueOnce({
          data: {
            title: 'New Post',
            description: 'New description',
            date: '2024-01-15',
            tags: [],
            author: 'Author',
            published: true,
          },
          content: 'New content',
        });
      
      const result = await getAllPosts();
      
      expect(result[0].title).toBe('New Post');
      expect(result[1].title).toBe('Old Post');
    });

    it('should skip invalid posts and continue processing', async () => {
      const mockFiles = ['valid-post.md', 'invalid-post.md'];
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(mockFiles as any);
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseFrontmatter
        .mockReturnValueOnce({
          data: {
            title: 'Valid Post',
            description: 'Valid description',
            date: '2024-01-15',
            tags: [],
            author: 'Author',
            published: true,
          },
          content: 'Valid content',
        })
        .mockImplementationOnce(() => {
          throw new Error('Invalid frontmatter');
        });
      
      const result = await getAllPosts();
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Valid Post');
    });

    it('should handle validation errors', async () => {
      const mockFiles = ['post.md'];
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(mockFiles as any);
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseFrontmatter.mockReturnValue({
        data: {
          title: 'Test Post',
          description: 'Test description',
          date: '2024-01-15',
          tags: [],
          author: 'Author',
          published: true,
        },
        content: 'Test content',
      });
      
      mockValidateBlogPost.mockReturnValue({
        isValid: false,
        errors: ['Validation error'],
        warnings: [],
      });
      
      const result = await getAllPosts();
      
      expect(result).toHaveLength(0); // Post should be skipped due to validation error
    });

    it('should calculate reading time and word count', async () => {
      const mockFiles = ['post.md'];
      const longContent = 'word '.repeat(400); // 400 words
      
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(mockFiles as any);
      mockFs.readFileSync.mockReturnValue('mock file content');
      
      mockParseFrontmatter.mockReturnValue({
        data: {
          title: 'Test Post',
          description: 'Test description',
          date: '2024-01-15',
          tags: [],
          author: 'Author',
          published: true,
        },
        content: longContent,
      });
      
      const result = await getAllPosts();
      
      expect(result[0].readingTime).toBe(2); // 400 words / 200 words per minute = 2 minutes
      expect(result[0].wordCount).toBe(400);
    });
  });

  describe('getPostBySlug', () => {
    it('should return null for invalid slug', async () => {
      const result1 = await getPostBySlug('');
      const result2 = await getPostBySlug(null as any);
      
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });

    it('should return null when posts directory does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = await getPostBySlug('test-post');
      
      expect(result).toBeNull();
    });

    it('should return null when post file does not exist', async () => {
      mockFs.existsSync
        .mockReturnValueOnce(true) // posts directory exists
        .mockReturnValueOnce(false) // .md file doesn't exist
        .mockReturnValueOnce(false); // .mdx file doesn't exist
      
      const result = await getPostBySlug('non-existent-post');
      
      expect(result).toBeNull();
    });

    it('should return post for valid slug (.md file)', async () => {
      const mockContent = `---
title: "Test Post"
description: "Test description"
date: "2024-01-15"
---

Test content`;
      
      mockFs.existsSync
        .mockReturnValueOnce(true) // posts directory exists
        .mockReturnValueOnce(true); // .md file exists
      
      mockFs.readFileSync.mockReturnValue(mockContent);
      
      mockParseFrontmatter.mockReturnValue({
        data: {
          title: 'Test Post',
          description: 'Test description',
          date: '2024-01-15',
          tags: ['test'],
          author: 'Test Author',
          published: true,
        },
        content: 'Test content with enough words for reading time calculation',
      });
      
      mockMarkdownToHtml.mockResolvedValue('<p>Test content with enough words for reading time calculation</p>');
      
      const result = await getPostBySlug('test-post');
      
      expect(result).toMatchObject({
        slug: 'test-post',
        title: 'Test Post',
        description: 'Test description',
        date: '2024-01-15',
        tags: ['test'],
        author: 'Test Author',
        published: true,
        content: '<p>Test content with enough words for reading time calculation</p>',
        readingTime: expect.any(Number),
        wordCount: expect.any(Number),
      });
    });

    it('should return post for valid slug (.mdx file)', async () => {
      const mockContent = `---
title: "MDX Post"
description: "MDX description"
date: "2024-01-15"
---

MDX content`;
      
      mockFs.existsSync
        .mockReturnValueOnce(true) // posts directory exists
        .mockReturnValueOnce(false) // .md file doesn't exist
        .mockReturnValueOnce(true); // .mdx file exists
      
      mockFs.readFileSync.mockReturnValue(mockContent);
      
      mockParseFrontmatter.mockReturnValue({
        data: {
          title: 'MDX Post',
          description: 'MDX description',
          date: '2024-01-15',
          tags: [],
          author: 'Author',
          published: true,
        },
        content: 'MDX content',
      });
      
      mockMarkdownToHtml.mockResolvedValue('<p>MDX content</p>');
      
      const result = await getPostBySlug('mdx-post');
      
      expect(result?.title).toBe('MDX Post');
      expect(result?.content).toBe('<p>MDX content</p>');
    });

    it('should sanitize slug to prevent directory traversal', async () => {
      const maliciousSlug = '../../../etc/passwd';
      
      mockFs.existsSync
        .mockReturnValueOnce(true) // posts directory exists
        .mockReturnValueOnce(false) // sanitized file doesn't exist
        .mockReturnValueOnce(false); // sanitized file doesn't exist
      
      const result = await getPostBySlug(maliciousSlug);
      
      expect(result).toBeNull();
      // Verify that the slug was sanitized (only alphanumeric, hyphens, underscores)
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.stringContaining('etcpasswd'));
    });

    it('should handle validation errors', async () => {
      mockFs.existsSync
        .mockReturnValueOnce(true) // posts directory exists
        .mockReturnValueOnce(true); // .md file exists
      
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseFrontmatter.mockReturnValue({
        data: {
          title: 'Test Post',
          description: 'Test description',
          date: '2024-01-15',
          tags: [],
          author: 'Author',
          published: true,
        },
        content: 'Test content',
      });
      
      mockValidateBlogPost.mockReturnValue({
        isValid: false,
        errors: ['Validation error'],
        warnings: [],
      });
      
      mockFormatValidationErrors.mockReturnValue('Formatted validation error');
      
      await expect(getPostBySlug('test-post')).rejects.toThrow(
        'Validation failed for post \'test-post\''
      );
    });

    it('should handle markdown processing errors', async () => {
      mockFs.existsSync
        .mockReturnValueOnce(true) // posts directory exists
        .mockReturnValueOnce(true); // .md file exists
      
      mockFs.readFileSync.mockReturnValue('mock content');
      
      mockParseFrontmatter.mockReturnValue({
        data: {
          title: 'Test Post',
          description: 'Test description',
          date: '2024-01-15',
          tags: [],
          author: 'Author',
          published: true,
        },
        content: 'Test content',
      });
      
      mockMarkdownToHtml.mockRejectedValue(new Error('Markdown processing failed'));
      
      await expect(getPostBySlug('test-post')).rejects.toThrow(
        'Failed to process post content'
      );
    });
  });
});