import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { markdownToHtml, parseFrontmatter, MarkdownOptions } from '../markdown';
import { PostMetadata } from '@/types/blog';

// Mock DOMPurify and JSDOM
jest.mock('dompurify', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    sanitize: jest.fn((html: string) => html.replace(/<script[^>]*>.*?<\/script>/gi, '')),
  })),
}));

jest.mock('jsdom', () => ({
  JSDOM: jest.fn(() => ({
    window: {
      document: {},
      HTMLElement: function() {},
      Element: function() {},
      DocumentFragment: function() {},
    },
  })),
}));

describe('Markdown Processing', () => {
  describe('markdownToHtml', () => {
    it('should convert basic markdown to HTML', async () => {
      const markdown = '# Hello World\n\nThis is **bold** text.';
      const result = await markdownToHtml(markdown);
      
      expect(result).toContain('<h1>Hello World</h1>');
      expect(result).toContain('<strong>bold</strong>');
      expect(result).toContain('<p>This is');
    });

    it('should handle empty markdown', async () => {
      const result = await markdownToHtml('');
      expect(result).toBe('');
    });

    it('should handle whitespace-only markdown', async () => {
      const result = await markdownToHtml('   \n\t  ');
      expect(result).toBe('');
    });

    it('should throw error for non-string input', async () => {
      await expect(markdownToHtml(null as any)).rejects.toThrow(
        'Markdown content must be a string'
      );
      await expect(markdownToHtml(123 as any)).rejects.toThrow(
        'Markdown content must be a string'
      );
    });

    it('should sanitize malicious content by default', async () => {
      const maliciousMarkdown = '<script>alert("XSS")</script>\n\n# Safe Content';
      const result = await markdownToHtml(maliciousMarkdown);
      
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('<h1>Safe Content</h1>');
    });

    it('should respect sanitize option when disabled', async () => {
      const options: MarkdownOptions = { sanitize: false };
      const markdown = '# Test\n\n<div>Custom HTML</div>';
      const result = await markdownToHtml(markdown, options);
      
      expect(result).toContain('<div>Custom HTML</div>');
    });

    it('should handle complex markdown structures', async () => {
      const complexMarkdown = `
# Main Title

## Subtitle

- List item 1
- List item 2
  - Nested item

\`\`\`javascript
const code = 'example';
\`\`\`

[Link](https://example.com)

> Blockquote text
      `;
      
      const result = await markdownToHtml(complexMarkdown);
      
      expect(result).toContain('<h1>Main Title</h1>');
      expect(result).toContain('<h2>Subtitle</h2>');
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>List item 1</li>');
      expect(result).toContain('<code>');
      expect(result).toContain('<a href="https://example.com">Link</a>');
      expect(result).toContain('<blockquote>');
    });

    it('should handle markdown with images', async () => {
      const markdown = '![Alt text](https://example.com/image.jpg "Title")';
      const result = await markdownToHtml(markdown);
      
      expect(result).toContain('<img');
      expect(result).toContain('src="https://example.com/image.jpg"');
      expect(result).toContain('alt="Alt text"');
      expect(result).toContain('title="Title"');
    });

    it('should handle tables', async () => {
      const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
      `;
      
      const result = await markdownToHtml(markdown);
      
      expect(result).toContain('<table>');
      expect(result).toContain('<thead>');
      expect(result).toContain('<tbody>');
      expect(result).toContain('<th>Header 1</th>');
      expect(result).toContain('<td>Cell 1</td>');
    });
  });

  describe('parseFrontmatter', () => {
    const validFrontmatter = `---
title: "Test Post"
description: "A test blog post"
date: "2024-01-15"
tags: ["javascript", "testing"]
author: "John Doe"
published: true
---

# Content

This is the post content.`;

    it('should parse valid frontmatter', () => {
      const result = parseFrontmatter(validFrontmatter);
      
      expect(result.data.title).toBe('Test Post');
      expect(result.data.description).toBe('A test blog post');
      expect(result.data.date).toBe('2024-01-15');
      expect(result.data.tags).toEqual(['javascript', 'testing']);
      expect(result.data.author).toBe('John Doe');
      expect(result.data.published).toBe(true);
      expect(result.content).toContain('# Content');
      expect(result.content).toContain('This is the post content.');
    });

    it('should handle minimal required frontmatter', () => {
      const minimalFrontmatter = `---
title: "Minimal Post"
description: "Minimal description"
date: "2024-01-15"
---

# Minimal Content`;
      
      const result = parseFrontmatter(minimalFrontmatter);
      
      expect(result.data.title).toBe('Minimal Post');
      expect(result.data.description).toBe('Minimal description');
      expect(result.data.date).toBe('2024-01-15');
      expect(result.content).toContain('# Minimal Content');
    });

    it('should throw error for non-string input', () => {
      expect(() => parseFrontmatter(null as any)).toThrow(
        'Markdown content must be a string'
      );
      expect(() => parseFrontmatter(123 as any)).toThrow(
        'Markdown content must be a string'
      );
    });

    it('should throw error for empty content', () => {
      expect(() => parseFrontmatter('')).toThrow(
        'Markdown content cannot be empty'
      );
      expect(() => parseFrontmatter('   \n\t  ')).toThrow(
        'Markdown content cannot be empty'
      );
    });

    it('should throw error for missing required fields', () => {
      const invalidFrontmatter = `---
title: "Test Post"
---

# Content`;
      
      expect(() => parseFrontmatter(invalidFrontmatter)).toThrow(
        'Invalid frontmatter'
      );
    });

    it('should throw error for empty content body', () => {
      const emptyBodyFrontmatter = `---
title: "Test Post"
description: "A test blog post"
date: "2024-01-15"
---

   `;
      
      expect(() => parseFrontmatter(emptyBodyFrontmatter)).toThrow(
        'Markdown content body cannot be empty'
      );
    });

    it('should handle frontmatter with optional fields', () => {
      const frontmatterWithOptionals = `---
title: "Test Post"
description: "A test blog post"
date: "2024-01-15"
tags: ["javascript", "testing"]
author: "John Doe"
published: true
image: "/images/test.jpg"
category: "Technology"
---

# Content with optionals`;
      
      const result = parseFrontmatter(frontmatterWithOptionals);
      
      expect(result.data.image).toBe('/images/test.jpg');
      expect(result.data.category).toBe('Technology');
    });

    it('should handle frontmatter with invalid date format', () => {
      const invalidDateFrontmatter = `---
title: "Test Post"
description: "A test blog post"
date: "invalid-date"
---

# Content`;
      
      expect(() => parseFrontmatter(invalidDateFrontmatter)).toThrow(
        'Invalid frontmatter'
      );
    });

    it('should handle frontmatter with invalid tags', () => {
      const invalidTagsFrontmatter = `---
title: "Test Post"
description: "A test blog post"
date: "2024-01-15"
tags: "not-an-array"
---

# Content`;
      
      expect(() => parseFrontmatter(invalidTagsFrontmatter)).toThrow(
        'Invalid frontmatter'
      );
    });

    it('should handle frontmatter without frontmatter delimiters', () => {
      const noFrontmatter = '# Just Content\n\nNo frontmatter here.';
      
      expect(() => parseFrontmatter(noFrontmatter)).toThrow(
        'Invalid frontmatter'
      );
    });
  });
});