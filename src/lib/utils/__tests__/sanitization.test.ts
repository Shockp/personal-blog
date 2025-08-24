import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  escapeHtml,
  unescapeHtml,
  sanitizeUserContent,
  sanitizeSearchQuery,
  sanitizeUrlParameter,
  sanitizeFormInput,
  sanitizeJsonInput,
  sanitizeFilename,
} from '../sanitization';

describe('Sanitization Functions', () => {
  describe('escapeHtml', () => {
    it('should escape basic HTML characters', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape ampersands', () => {
      const input = 'Tom & Jerry';
      const expected = 'Tom &amp; Jerry';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(escapeHtml(null as any)).toBe('');
      expect(escapeHtml(undefined as any)).toBe('');
    });
  });

  describe('unescapeHtml', () => {
    it('should unescape HTML entities', () => {
      const input = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      const expected = '<script>alert("XSS")</script>';
      expect(unescapeHtml(input)).toBe(expected);
    });

    it('should handle mixed content', () => {
      const input = 'Hello &amp; welcome to &lt;our&gt; site!';
      const expected = 'Hello & welcome to <our> site!';
      expect(unescapeHtml(input)).toBe(expected);
    });
  });

  describe('sanitizeUserContent', () => {
    it('should remove script tags', () => {
      const maliciousInputs = [
        '<script>alert("XSS")</script>',
        '<SCRIPT>alert("XSS")</SCRIPT>',
        '<script type="text/javascript">alert("XSS")</script>',
        '<script src="malicious.js"></script>',
      ];

      maliciousInputs.forEach(input => {
        const result = sanitizeUserContent(input);
        expect(result).not.toContain('<script');
        expect(result).not.toContain('</script>');
        expect(result).not.toContain('alert');
      });
    });

    it('should remove iframe tags', () => {
      const input = '<iframe src="javascript:alert(1)"></iframe>';
      const result = sanitizeUserContent(input);
      expect(result).not.toContain('<iframe');
      expect(result).not.toContain('javascript:');
    });

    it('should remove object and embed tags', () => {
      const inputs = [
        '<object data="malicious.swf"></object>',
        '<embed src="malicious.swf">',
      ];

      inputs.forEach(input => {
        const result = sanitizeUserContent(input);
        expect(result).not.toContain('<object');
        expect(result).not.toContain('<embed');
      });
    });

    it('should remove event handlers', () => {
      const maliciousInputs = [
        '<div onclick="alert(1)">Click me</div>',
        '<img src="x" onerror="alert(1)">',
        '<body onload="alert(1)">',
        '<input onfocus="alert(1)">',
      ];

      maliciousInputs.forEach(input => {
        const result = sanitizeUserContent(input);
        expect(result).not.toMatch(/on\w+\s*=/i);
      });
    });

    it('should remove javascript: URLs', () => {
      const maliciousInputs = [
        '<a href="javascript:alert(1)">Link</a>',
        '<img src="javascript:alert(1)">',
        '<form action="javascript:alert(1)">',
      ];

      maliciousInputs.forEach(input => {
        const result = sanitizeUserContent(input);
        expect(result).not.toContain('javascript:');
      });
    });

    it('should preserve safe text content', () => {
      const safeInput = '<p>This is <strong>safe</strong> content with <em>emphasis</em>.</p>';
      const result = sanitizeUserContent(safeInput);
      expect(result).toContain('This is');
      expect(result).toContain('safe');
      expect(result).toContain('content with');
      expect(result).toContain('emphasis');
    });

    it('should handle complex XSS attempts', () => {
      const complexXSS = [
        // SVG-based XSS
        '<svg onload="alert(1)">',
        // Data URI XSS
        '<img src="data:text/html,<script>alert(1)</script>">',
        // CSS expression XSS
        '<div style="background:url(javascript:alert(1))">',
        // Meta refresh XSS
        '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
        // Base64 encoded XSS
        '<img src="data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+">',
      ];

      complexXSS.forEach(input => {
        const result = sanitizeUserContent(input);
        expect(result).not.toContain('alert');
        expect(result).not.toContain('javascript:');
        expect(result).not.toMatch(/on\w+\s*=/i);
      });
    });
  });

  describe('sanitizeSearchQuery', () => {
    it('should remove HTML tags from search queries', () => {
      const input = '<script>alert(1)</script>search term';
      const result = sanitizeSearchQuery(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('search term');
    });

    it('should handle SQL injection attempts', () => {
      const sqlInjections = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "UNION SELECT * FROM passwords",
        "1; DELETE FROM posts",
      ];

      sqlInjections.forEach(input => {
        const result = sanitizeSearchQuery(input);
        expect(result).not.toMatch(/drop|delete|union|select/i);
      });
    });

    it('should preserve normal search terms', () => {
      const normalQueries = [
        'javascript tutorial',
        'react hooks',
        'css grid layout',
        'node.js best practices',
      ];

      normalQueries.forEach(input => {
        const result = sanitizeSearchQuery(input);
        expect(result.length).toBeGreaterThan(0);
        expect(result).not.toContain('<');
        expect(result).not.toContain('>');
      });
    });
  });

  describe('sanitizeUrlParameter', () => {
    it('should remove dangerous characters', () => {
      const input = 'hello world & more<script>';
      const result = sanitizeUrlParameter(input);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('&');
    });

    it('should handle malicious URL parameters', () => {
      const maliciousParams = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'vbscript:msgbox(1)',
      ];

      maliciousParams.forEach(input => {
        const result = sanitizeUrlParameter(input);
        expect(result).not.toContain('../');
        expect(result).not.toContain('..\\');
        expect(result).not.toContain('javascript:');
        expect(result).not.toContain('data:');
        expect(result).not.toContain('vbscript:');
      });
    });
  });

  describe('sanitizeFormInput', () => {
    it('should trim whitespace and escape HTML', () => {
      const input = '  <script>alert("xss")</script>  ';
      const result = sanitizeFormInput(input);
      expect(result).not.toContain('<script>');
      expect(result.startsWith(' ')).toBe(false);
      expect(result.endsWith(' ')).toBe(false);
    });

    it('should handle form injection attempts', () => {
      const formInjections = [
        '<input type="hidden" name="admin" value="true">',
        '</form><form action="malicious.com">',
        '<textarea>malicious content</textarea>',
      ];

      formInjections.forEach(input => {
        const result = sanitizeFormInput(input);
        expect(result).not.toContain('<input');
        expect(result).not.toContain('<form');
        expect(result).not.toContain('<textarea');
      });
    });
  });

  describe('sanitizeJsonInput', () => {
    it('should handle JSON injection attempts', () => {
      const jsonInjections = [
        '{"__proto__":{"admin":true}}',
        '{"constructor":{"prototype":{"admin":true}}}',
        '{"eval":"alert(1)"}',
      ];

      jsonInjections.forEach(input => {
        const result = sanitizeJsonInput(input);
        expect(result).not.toContain('__proto__');
        expect(result).not.toContain('constructor');
        expect(result).not.toContain('eval');
      });
    });

    it('should preserve valid JSON structure', () => {
      const validJson = '{"name":"John","age":30,"city":"New York"}';
      const result = sanitizeJsonInput(validJson);
      expect(() => JSON.parse(result)).not.toThrow();
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove path traversal attempts', () => {
      const maliciousFilenames = [
        '../../../etc/passwd',
        '..\\..\\windows\\system32\\config',
        '/etc/shadow',
        'C:\\Windows\\System32\\drivers\\etc\\hosts',
      ];

      maliciousFilenames.forEach(input => {
        const result = sanitizeFilename(input);
        expect(result).not.toContain('../');
        expect(result).not.toContain('..\\');
        expect(result).not.toContain('/');
        expect(result).not.toContain('\\');
        expect(result).not.toContain(':');
      });
    });

    it('should preserve safe filename characters', () => {
      const safeFilenames = [
        'document.pdf',
        'image_2023.jpg',
        'my-file-name.txt',
        'report.2023.xlsx',
      ];

      safeFilenames.forEach(input => {
        const result = sanitizeFilename(input);
        expect(result.length).toBeGreaterThan(0);
        expect(result).toMatch(/^[a-zA-Z0-9._-]+$/);
      });
    });

    it('should handle special characters in filenames', () => {
      const specialFilenames = [
        'file with spaces.txt',
        'file@email.com.pdf',
        'file#hash.jpg',
        'file%percent.png',
      ];

      specialFilenames.forEach(input => {
        const result = sanitizeFilename(input);
        expect(result).not.toContain(' ');
        expect(result).not.toContain('@');
        expect(result).not.toContain('#');
        expect(result).not.toContain('%');
      });
    });
  });

  describe('Edge Cases and Performance', () => {
    it('should handle very long inputs', () => {
      const longInput = 'a'.repeat(10000) + '<script>alert(1)</script>';
      const result = sanitizeUserContent(longInput);
      expect(result).not.toContain('<script>');
      expect(result.length).toBeLessThan(longInput.length);
    });

    it('should handle unicode characters', () => {
      const unicodeInput = '🚀 Hello 世界 <script>alert(1)</script>';
      const result = sanitizeUserContent(unicodeInput);
      expect(result).toContain('🚀');
      expect(result).toContain('世界');
      expect(result).not.toContain('<script>');
    });

    it('should handle nested malicious content', () => {
      const nestedInput = '<div><span><script>alert(1)</script></span></div>';
      const result = sanitizeUserContent(nestedInput);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should handle malformed HTML', () => {
      const malformedInputs = [
        '<script><script>alert(1)</script>',
        '<img src="x" onerror="alert(1)" />',
        '<div onclick="alert(1)" style="color:red">',
      ];

      malformedInputs.forEach(input => {
        const result = sanitizeUserContent(input);
        expect(result).not.toContain('alert');
        expect(result).not.toMatch(/on\w+\s*=/i);
      });
    });
  });

  describe('Real-world Attack Vectors', () => {
    it('should prevent DOM-based XSS', () => {
      const domXSS = [
        '<img src=x onerror=alert(document.cookie)>',
        '<svg/onload=alert(1)>',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<object data="data:text/html,<script>alert(1)</script>"></object>',
      ];

      domXSS.forEach(input => {
        const result = sanitizeUserContent(input);
        expect(result).not.toContain('alert');
        expect(result).not.toContain('javascript:');
        expect(result).not.toMatch(/on\w+\s*=/i);
      });
    });

    it('should prevent CSS injection', () => {
      const cssInjection = [
        '<div style="background:url(javascript:alert(1))">',
        '<style>body{background:url(javascript:alert(1))}</style>',
        '<link rel="stylesheet" href="javascript:alert(1)">',
      ];

      cssInjection.forEach(input => {
        const result = sanitizeUserContent(input);
        expect(result).not.toContain('javascript:');
        expect(result).not.toContain('alert');
      });
    });

    it('should prevent prototype pollution', () => {
      const prototypePollution = [
        '{"__proto__":{"isAdmin":true}}',
        '{"constructor":{"prototype":{"isAdmin":true}}}',
      ];

      prototypePollution.forEach(input => {
        const result = sanitizeJsonInput(input);
        expect(result).not.toContain('__proto__');
        expect(result).not.toContain('constructor');
      });
    });
  });
});