import { NextRequest, NextResponse } from 'next/server';

interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    referrer: string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    disposition: string;
    'blocked-uri': string;
    'line-number': number;
    'column-number': number;
    'source-file': string;
    'status-code': number;
    'script-sample': string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const report: CSPViolationReport = await request.json();
    const violation = report['csp-report'];
    
    // Log the violation (in production, you might want to send this to a monitoring service)
    console.warn('CSP Violation Report:', {
      documentUri: violation['document-uri'],
      violatedDirective: violation['violated-directive'],
      blockedUri: violation['blocked-uri'],
      sourceFile: violation['source-file'],
      lineNumber: violation['line-number'],
      columnNumber: violation['column-number'],
      scriptSample: violation['script-sample'],
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });
    
    // In production, you might want to:
    // 1. Store violations in a database
    // 2. Send alerts for critical violations
    // 3. Aggregate violation statistics
    // 4. Filter out known false positives
    
    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error) {
    console.error('Error processing CSP violation report:', error);
    return NextResponse.json({ error: 'Invalid report format' }, { status: 400 });
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'CSP violation reporting endpoint is active',
    timestamp: new Date().toISOString()
  });
}