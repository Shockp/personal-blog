import { describe, it, expect } from '@jest/globals';
import {
  ValidationPatterns,
  searchQuerySchema,
  contactFormSchema,
  commentFormSchema,
  newsletterSchema,
  fileUploadSchema,
  urlParamsSchema,
  validateInput,
  safeValidate,
  validateSearchQuery,
  validateContactForm,
  validateCommentForm,
  validateNewsletter,
  validateFileUpload,
  validateUrlParams,
  containsDangerousContent,
  validateUserInput,
  sanitizeAndValidate,
} from '../input-validation';

describe('Input Validation', () => {
  describe('ValidationPatterns', () => {
    it('should validate email patterns', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ];
      
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
      ];
      
      validEmails.forEach(email => {
        expect(ValidationPatterns.email.test(email)).toBe(true);
      });
      
      invalidEmails.forEach(email => {
        expect(ValidationPatterns.email.test(email)).toBe(false);
      });
    });
    
    it('should validate URL patterns', () => {
      const validUrls = [
        'https://example.com',
        'http://www.example.com/path',
        'https://subdomain.example.com/path?query=value',
      ];
      
      const invalidUrls = [
        'ftp://example.com',
        'javascript:alert(1)',
        'not-a-url',
        'http://',
      ];
      
      validUrls.forEach(url => {
        expect(ValidationPatterns.url.test(url)).toBe(true);
      });
      
      invalidUrls.forEach(url => {
        expect(ValidationPatterns.url.test(url)).toBe(false);
      });
    });
    
    it('should validate slug patterns', () => {
      const validSlugs = [
        'hello-world',
        'my-blog-post',
        'simple',
        'post-123',
      ];
      
      const invalidSlugs = [
        'Hello World',
        'post_with_underscores',
        'post with spaces',
        'post@email',
      ];
      
      validSlugs.forEach(slug => {
        expect(ValidationPatterns.slug.test(slug)).toBe(true);
      });
      
      invalidSlugs.forEach(slug => {
        expect(ValidationPatterns.slug.test(slug)).toBe(false);
      });
    });
    
    it('should detect HTML content', () => {
      const htmlContent = [
        '<script>alert(1)</script>',
        '<div>content</div>',
        'Hello <strong>world</strong>',
      ];
      
      const safeContent = [
        'Hello world',
        'This is safe content',
        'No HTML here!',
      ];
      
      htmlContent.forEach(content => {
        expect(ValidationPatterns.noHtml.test(content)).toBe(false);
      });
      
      safeContent.forEach(content => {
        expect(ValidationPatterns.noHtml.test(content)).toBe(true);
      });
    });
    
    it('should detect script content', () => {
      const scriptContent = [
        '<script>alert(1)</script>',
        '<SCRIPT>malicious</SCRIPT>',
        'Some <script type="text/javascript">code</script>',
      ];
      
      const safeContent = [
        'Hello world',
        'This mentions script but not as tag',
        'JavaScript is a programming language',
      ];
      
      scriptContent.forEach(content => {
        expect(ValidationPatterns.noScript.test(content)).toBe(false);
      });
      
      safeContent.forEach(content => {
        expect(ValidationPatterns.noScript.test(content)).toBe(true);
      });
    });
  });
  
  describe('searchQuerySchema', () => {
    it('should validate valid search queries', () => {
      const validQueries = [
        { q: 'javascript tutorial' },
        { q: 'react hooks', category: 'programming' },
        { q: 'css grid', tags: ['css', 'layout'], limit: 20 },
      ];
      
      validQueries.forEach(query => {
        const result = validateSearchQuery(query);
        expect(result.success).toBe(true);
      });
    });
    
    it('should reject malicious search queries', () => {
      const maliciousQueries = [
        { q: '<script>alert(1)</script>' },
        { q: 'search', category: '../../../etc/passwd' },
        { q: 'test', tags: ['<script>alert(1)</script>'] },
        { q: 'a'.repeat(201) }, // Too long
      ];
      
      maliciousQueries.forEach(query => {
        const result = validateSearchQuery(query);
        expect(result.success).toBe(false);
      });
    });
    
    it('should sanitize search queries', () => {
      const input = { q: '<script>alert(1)</script>search term' };
      const result = validateSearchQuery(input);
      
      if (result.success) {
        expect(result.data.q).not.toContain('<script>');
        expect(result.data.q).toContain('search term');
      }
    });
  });
  
  describe('contactFormSchema', () => {
    it('should validate valid contact forms', () => {
      const validForms = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Hello there',
          message: 'This is a test message with enough content.',
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Website feedback',
          message: 'Great website! I really enjoyed reading your articles.',
          website: 'https://jane-portfolio.com',
        },
      ];
      
      validForms.forEach(form => {
        const result = validateContactForm(form);
        expect(result.success).toBe(true);
      });
    });
    
    it('should reject malicious contact forms', () => {
      const maliciousForms = [
        {
          name: '<script>alert(1)</script>',
          email: 'test@example.com',
          subject: 'Test',
          message: 'Test message content here.',
        },
        {
          name: 'John',
          email: 'invalid-email',
          subject: 'Test',
          message: 'Test message content here.',
        },
        {
          name: 'John',
          email: 'test@example.com',
          subject: 'Test',
          message: '<script>alert(1)</script>',
        },
        {
          name: 'John',
          email: 'test@example.com',
          subject: 'Test',
          message: 'Short', // Too short
        },
      ];
      
      maliciousForms.forEach(form => {
        const result = validateContactForm(form);
        expect(result.success).toBe(false);
      });
    });
  });
  
  describe('commentFormSchema', () => {
    it('should validate valid comments', () => {
      const validComments = [
        {
          author: 'John Doe',
          email: 'john@example.com',
          content: 'Great article! Thanks for sharing.',
          postSlug: 'my-blog-post',
        },
        {
          author: 'Jane Smith',
          email: 'jane@example.com',
          website: 'https://jane.com',
          content: 'I found this very helpful. Looking forward to more content like this.',
          postSlug: 'another-post',
        },
      ];
      
      validComments.forEach(comment => {
        const result = validateCommentForm(comment);
        expect(result.success).toBe(true);
      });
    });
    
    it('should reject malicious comments', () => {
      const maliciousComments = [
        {
          author: '<script>alert(1)</script>',
          email: 'test@example.com',
          content: 'Test comment',
          postSlug: 'test-post',
        },
        {
          author: 'John',
          email: 'test@example.com',
          content: '<script>alert(1)</script>',
          postSlug: 'test-post',
        },
        {
          author: 'John',
          email: 'test@example.com',
          content: 'Test comment',
          postSlug: '../../../etc/passwd',
        },
      ];
      
      maliciousComments.forEach(comment => {
        const result = validateCommentForm(comment);
        expect(result.success).toBe(false);
      });
    });
  });
  
  describe('fileUploadSchema', () => {
    it('should validate valid file uploads', () => {
      const validFiles = [
        {
          filename: 'document.pdf',
          size: 1024 * 1024, // 1MB
          type: 'application/pdf',
        },
        {
          filename: 'image.jpg',
          size: 500 * 1024, // 500KB
          type: 'image/jpeg',
        },
      ];
      
      validFiles.forEach(file => {
        const result = validateFileUpload(file);
        expect(result.success).toBe(true);
      });
    });
    
    it('should reject malicious file uploads', () => {
      const maliciousFiles = [
        {
          filename: '../../../etc/passwd',
          size: 1024,
          type: 'text/plain',
        },
        {
          filename: 'script.exe',
          size: 1024,
          type: 'application/x-executable',
        },
        {
          filename: 'image.jpg',
          size: 20 * 1024 * 1024, // 20MB - too large
          type: 'image/jpeg',
        },
        {
          filename: 'file with spaces.txt',
          size: 1024,
          type: 'text/plain',
        },
      ];
      
      maliciousFiles.forEach(file => {
        const result = validateFileUpload(file);
        expect(result.success).toBe(false);
      });
    });
  });
  
  describe('containsDangerousContent', () => {
    it('should detect dangerous script content', () => {
      const dangerousContent = [
        '<script>alert(1)</script>',
        '<SCRIPT>malicious</SCRIPT>',
        'javascript:alert(1)',
        '<div onclick="alert(1)">',
        '<iframe src="malicious.com"></iframe>',
        '<object data="malicious.swf"></object>',
        '<embed src="malicious.swf">',
        'eval("malicious code")',
        'setTimeout("alert(1)", 1000)',
      ];
      
      dangerousContent.forEach(content => {
        expect(containsDangerousContent(content)).toBe(true);
      });
    });
    
    it('should not flag safe content', () => {
      const safeContent = [
        'Hello world',
        'This is a normal paragraph',
        'JavaScript is a programming language',
        'I like to script my workflows',
        'The evaluation was positive',
      ];
      
      safeContent.forEach(content => {
        expect(containsDangerousContent(content)).toBe(false);
      });
    });
  });
  
  describe('validateUserInput', () => {
    it('should validate and sanitize safe input', () => {
      const safeInput = 'This is safe user input';
      const result = validateUserInput(safeInput);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitized).toBe(safeInput);
    });
    
    it('should detect and sanitize dangerous input', () => {
      const dangerousInput = '<script>alert(1)</script>Hello world';
      const result = validateUserInput(dangerousInput);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.sanitized).not.toContain('<script>');
    });
    
    it('should enforce length limits', () => {
      const longInput = 'a'.repeat(1001);
      const result = validateUserInput(longInput, 1000);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input too long (max 1000 characters)');
    });
  });
  
  describe('sanitizeAndValidate', () => {
    it('should sanitize and validate with custom sanitizer', () => {
      const input = { name: '  <script>alert(1)</script>John  ' };
      const schema = contactFormSchema.pick({ name: true });
      
      const customSanitizer = (data: any) => ({
        ...data,
        name: data.name?.trim().replace(/<[^>]*>/g, ''),
      });
      
      const result = sanitizeAndValidate(schema, input, customSanitizer);
      
      if (result.success) {
        expect(result.data.name).not.toContain('<script>');
        expect(result.data.name.startsWith(' ')).toBe(false);
        expect(result.data.name.endsWith(' ')).toBe(false);
      }
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle null and undefined inputs', () => {
      const nullResult = safeValidate(searchQuerySchema, null);
      const undefinedResult = safeValidate(searchQuerySchema, undefined);
      
      expect(nullResult).toBeNull();
      expect(undefinedResult).toBeNull();
    });
    
    it('should handle empty objects', () => {
      const emptyResult = validateContactForm({});
      expect(emptyResult.success).toBe(false);
    });
    
    it('should handle unicode characters', () => {
      const unicodeInput = {
        q: '🚀 Hello 世界 search query',
      };
      
      const result = validateSearchQuery(unicodeInput);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.q).toContain('🚀');
        expect(result.data.q).toContain('世界');
      }
    });
    
    it('should handle very long inputs gracefully', () => {
      const veryLongInput = {
        q: 'a'.repeat(10000),
      };
      
      const result = validateSearchQuery(veryLongInput);
      expect(result.success).toBe(false);
    });
  });
  
  describe('Real-world Attack Scenarios', () => {
    it('should prevent XSS in search queries', () => {
      const xssAttempts = [
        { q: '<img src=x onerror=alert(1)>' },
        { q: '<svg onload=alert(1)>' },
        { q: 'javascript:alert(document.cookie)' },
        { q: '\x3cscript\x3ealert(1)\x3c/script\x3e' },
      ];
      
      xssAttempts.forEach(attempt => {
        const result = validateSearchQuery(attempt);
        if (result.success) {
          expect(result.data.q).not.toContain('alert');
          expect(result.data.q).not.toContain('<script');
          expect(result.data.q).not.toContain('javascript:');
        }
      });
    });
    
    it('should prevent SQL injection in form inputs', () => {
      const sqlInjectionAttempts = [
        {
          name: "'; DROP TABLE users; --",
          email: 'test@example.com',
          subject: 'Test',
          message: 'Test message content here.',
        },
        {
          name: "' OR '1'='1",
          email: 'test@example.com',
          subject: 'Test',
          message: 'Test message content here.',
        },
      ];
      
      sqlInjectionAttempts.forEach(attempt => {
        const result = validateContactForm(attempt);
        if (result.success) {
          expect(result.data.name).not.toContain('DROP TABLE');
          expect(result.data.name).not.toContain("OR '1'='1");
        }
      });
    });
    
    it('should prevent path traversal in file uploads', () => {
      const pathTraversalAttempts = [
        {
          filename: '../../../etc/passwd',
          size: 1024,
          type: 'text/plain',
        },
        {
          filename: '..\\..\\windows\\system32\\config',
          size: 1024,
          type: 'text/plain',
        },
      ];
      
      pathTraversalAttempts.forEach(attempt => {
        const result = validateFileUpload(attempt);
        expect(result.success).toBe(false);
      });
    });
  });
});