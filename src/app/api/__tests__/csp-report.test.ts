import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { POST } from '../csp-report/route';

// Mock NextResponse
const mockJson = jest.fn();
const MockNextResponse = {
  json: mockJson,
};

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: MockNextResponse,
}));

// Mock console methods
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

// Sample CSP violation report
const mockCSPReport = {
  'csp-report': {
    'document-uri': 'https://example.com/page',
    'referrer': 'https://example.com',
    'violated-directive': 'script-src',
    'effective-directive': 'script-src',
    'original-policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
    'disposition': 'enforce',
    'blocked-uri': 'https://malicious-site.com/script.js',
    'line-number': 42,
    'column-number': 15,
    'source-file': 'https://example.com/page',
    'status-code': 200,
    'script-sample': 'console.log("malicious code")'
  }
};

describe('CSP Report API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockJson.mockImplementation((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
      ...options,
    }));
  });

  afterEach(() => {
    mockConsoleWarn.mockClear();
    mockConsoleError.mockClear();
  });

  describe('POST /api/csp-report', () => {
    it('should process valid CSP violation report', async () => {
      const request = {
        json: jest.fn().mockResolvedValue(mockCSPReport),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(request.json).toHaveBeenCalled();
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        expect.objectContaining({
          documentUri: 'https://example.com/page',
          violatedDirective: 'script-src',
          blockedUri: 'https://malicious-site.com/script.js',
          sourceFile: 'https://example.com/page',
          lineNumber: 42,
          columnNumber: 15,
        })
      );
      expect(mockJson).toHaveBeenCalledWith(
        { message: 'CSP violation report received' },
        { status: 200 }
      );
    });

    it('should handle CSP report with minimal data', async () => {
      const minimalReport = {
        'csp-report': {
          'violated-directive': 'img-src',
          'blocked-uri': 'https://untrusted-image.com/image.jpg',
        }
      };

      const request = {
        json: jest.fn().mockResolvedValue(minimalReport),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        expect.objectContaining({
          violatedDirective: 'img-src',
          blockedUri: 'https://untrusted-image.com/image.jpg',
        })
      );
      expect(mockJson).toHaveBeenCalledWith(
        { message: 'CSP violation report received' },
        { status: 200 }
      );
    });

    it('should handle different violation types', async () => {
      const styleViolation = {
        'csp-report': {
          'violated-directive': 'style-src',
          'blocked-uri': 'inline',
          'document-uri': 'https://example.com/styles',
          'effective-directive': 'style-src',
        }
      };

      const request = {
        json: jest.fn().mockResolvedValue(styleViolation),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        expect.objectContaining({
          violatedDirective: 'style-src',
          blockedUri: 'inline',
          documentUri: 'https://example.com/styles',
        })
      );
    });

    it('should handle connect-src violations', async () => {
      const connectViolation = {
        'csp-report': {
          'violated-directive': 'connect-src',
          'blocked-uri': 'https://api.malicious.com/data',
          'document-uri': 'https://example.com/app',
          'referrer': 'https://example.com',
        }
      };

      const request = {
        json: jest.fn().mockResolvedValue(connectViolation),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        expect.objectContaining({
          violatedDirective: 'connect-src',
          blockedUri: 'https://api.malicious.com/data',
        })
      );
    });

    it('should handle frame-src violations', async () => {
      const frameViolation = {
        'csp-report': {
          'violated-directive': 'frame-src',
          'blocked-uri': 'https://untrusted-frame.com',
          'document-uri': 'https://example.com/embed',
        }
      };

      const request = {
        json: jest.fn().mockResolvedValue(frameViolation),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        expect.objectContaining({
          violatedDirective: 'frame-src',
          blockedUri: 'https://untrusted-frame.com',
        })
      );
    });

    it('should handle missing csp-report field', async () => {
      const invalidReport = {
        'invalid-field': 'some data'
      };

      const request = {
        json: jest.fn().mockResolvedValue(invalidReport),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Invalid CSP report format:',
        invalidReport
      );
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Invalid CSP report format' },
        { status: 400 }
      );
    });

    it('should handle empty csp-report object', async () => {
      const emptyReport = {
        'csp-report': {}
      };

      const request = {
        json: jest.fn().mockResolvedValue(emptyReport),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        {}
      );
      expect(mockJson).toHaveBeenCalledWith(
        { message: 'CSP violation report received' },
        { status: 200 }
      );
    });

    it('should handle null csp-report', async () => {
      const nullReport = {
        'csp-report': null
      };

      const request = {
        json: jest.fn().mockResolvedValue(nullReport),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Invalid CSP report format:',
        nullReport
      );
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Invalid CSP report format' },
        { status: 400 }
      );
    });

    it('should handle JSON parsing errors', async () => {
      const request = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error processing CSP report:',
        expect.any(Error)
      );
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Failed to process CSP report' },
        { status: 500 }
      );
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      
      const request = {
        json: jest.fn().mockRejectedValue(timeoutError),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error processing CSP report:',
        timeoutError
      );
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Failed to process CSP report' },
        { status: 500 }
      );
    });

    it('should handle malformed request body', async () => {
      const request = {
        json: jest.fn().mockResolvedValue('not an object'),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Invalid CSP report format:',
        'not an object'
      );
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Invalid CSP report format' },
        { status: 400 }
      );
    });

    it('should handle array instead of object', async () => {
      const arrayReport = ['invalid', 'array', 'data'];

      const request = {
        json: jest.fn().mockResolvedValue(arrayReport),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Invalid CSP report format:',
        arrayReport
      );
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Invalid CSP report format' },
        { status: 400 }
      );
    });

    it('should log all available CSP report fields', async () => {
      const completeReport = {
        'csp-report': {
          'document-uri': 'https://example.com/complete',
          'referrer': 'https://example.com/referrer',
          'violated-directive': 'script-src',
          'effective-directive': 'script-src',
          'original-policy': "default-src 'self'; script-src 'self'",
          'disposition': 'enforce',
          'blocked-uri': 'https://blocked.com/script.js',
          'line-number': 100,
          'column-number': 25,
          'source-file': 'https://example.com/source.js',
          'status-code': 200,
          'script-sample': 'eval("malicious code")',
        }
      };

      const request = {
        json: jest.fn().mockResolvedValue(completeReport),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        expect.objectContaining({
          documentUri: 'https://example.com/complete',
          referrer: 'https://example.com/referrer',
          violatedDirective: 'script-src',
          effectiveDirective: 'script-src',
          originalPolicy: "default-src 'self'; script-src 'self'",
          disposition: 'enforce',
          blockedUri: 'https://blocked.com/script.js',
          lineNumber: 100,
          columnNumber: 25,
          sourceFile: 'https://example.com/source.js',
          statusCode: 200,
          scriptSample: 'eval("malicious code")',
        })
      );
    });

    it('should handle special characters in violation data', async () => {
      const specialCharsReport = {
        'csp-report': {
          'violated-directive': 'script-src',
          'blocked-uri': 'data:text/javascript,alert("XSS")',
          'script-sample': '<script>alert("test")</script>',
          'document-uri': 'https://example.com/page?param=value&other=test',
        }
      };

      const request = {
        json: jest.fn().mockResolvedValue(specialCharsReport),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        expect.objectContaining({
          violatedDirective: 'script-src',
          blockedUri: 'data:text/javascript,alert("XSS")',
          scriptSample: '<script>alert("test")</script>',
          documentUri: 'https://example.com/page?param=value&other=test',
        })
      );
      expect(mockJson).toHaveBeenCalledWith(
        { message: 'CSP violation report received' },
        { status: 200 }
      );
    });
  });

  describe('Security', () => {
    it('should not execute any code from violation reports', async () => {
      const maliciousReport = {
        'csp-report': {
          'violated-directive': 'script-src',
          'script-sample': 'eval("console.log(\'executed\')")',
          'blocked-uri': 'javascript:alert("xss")',
        }
      };

      const request = {
        json: jest.fn().mockResolvedValue(maliciousReport),
      } as unknown as NextRequest;

      // This should not execute any code
      const response = await POST(request);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        expect.objectContaining({
          scriptSample: 'eval("console.log(\'executed\')")',
          blockedUri: 'javascript:alert("xss")',
        })
      );
      expect(mockJson).toHaveBeenCalledWith(
        { message: 'CSP violation report received' },
        { status: 200 }
      );
    });

    it('should handle extremely large violation reports', async () => {
      const largeScript = 'a'.repeat(10000);
      const largeReport = {
        'csp-report': {
          'violated-directive': 'script-src',
          'script-sample': largeScript,
          'blocked-uri': 'https://example.com/' + 'b'.repeat(1000),
        }
      };

      const request = {
        json: jest.fn().mockResolvedValue(largeReport),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'CSP Violation:',
        expect.objectContaining({
          scriptSample: largeScript,
          blockedUri: expect.stringContaining('https://example.com/'),
        })
      );
      expect(mockJson).toHaveBeenCalledWith(
        { message: 'CSP violation report received' },
        { status: 200 }
      );
    });
  });
});