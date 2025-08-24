import { NextRequest, NextResponse } from 'next/server';
import { generateNonce } from './lib/nonce';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle static asset caching
  if (pathname.startsWith('/_next/static/') || 
      pathname.startsWith('/images/') ||
      pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|eot|css|js)$/)) {
    const response = NextResponse.next();
    
    // Set cache headers for static assets
    if (pathname.startsWith('/_next/static/')) {
      // Next.js static assets - cache for 1 year
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/)) {
      // Images - cache for 1 month
      response.headers.set('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
    } else if (pathname.match(/\.(woff|woff2|ttf|eot)$/)) {
      // Fonts - cache for 1 year
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (pathname.match(/\.(css|js)$/)) {
      // CSS/JS files - cache for 1 week
      response.headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
    
    return response;
  }
  
  // Generate a unique nonce for this request
  const nonce = generateNonce();
  
  // Create response
  const response = NextResponse.next();
  
  // Set nonce in response headers for use in components
  response.headers.set('x-nonce', nonce);
  
  // Update CSP header with actual nonce
  const cspHeader = process.env.NODE_ENV === 'development'
    ? // Development CSP - more permissive for hot reload and dev tools
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https: http:",
        "media-src 'self' data: blob:",
        "connect-src 'self' https://vercel.live wss://vercel.live",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
      ].join('; ')
    : // Production CSP - strict security with nonce
      [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}'`,
        `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https:",
        "media-src 'self' data: blob:",
        "connect-src 'self'",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
        "report-uri /api/csp-report"
      ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths including static assets for caching,
     * but exclude API routes and Next.js image optimization
     */
    '/((?!api|_next/image).*)',
  ],
};