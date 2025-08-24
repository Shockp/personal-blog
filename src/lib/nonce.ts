/**
 * Generate a cryptographically secure nonce for CSP
 * @returns A base64-encoded nonce string
 */
export function generateNonce(): string {
  // Use Web Crypto API for Edge Runtime compatibility
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }
  
  // Fallback for environments without crypto
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < 22; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Get or generate nonce for the current request
 * This should be called once per request and reused
 */
export async function getNonce(): Promise<string> {
  if (typeof window !== 'undefined') {
    // Client-side: try to get from meta tag
    const metaTag = document.querySelector('meta[name="csp-nonce"]');
    if (metaTag) {
      return metaTag.getAttribute('content') || generateNonce();
    }
    return generateNonce();
  }

  // Server-side: get nonce from request headers (set by middleware)
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    
    // Get nonce from request headers (set by middleware)
    const requestNonce = headersList.get('x-nonce');
    if (requestNonce) {
      return requestNonce;
    }
  } catch (error) {
    // Fallback if headers are not available
    console.warn('Could not access headers for nonce, generating fallback nonce');
  }

  // Generate new nonce as fallback
  return generateNonce();
}

/**
 * Create a nonce-enabled script tag
 * @param nonce The nonce value
 * @param content The script content
 * @returns Script tag with nonce attribute
 */
export function createNonceScript(nonce: string, content: string): string {
  return `<script nonce="${nonce}">${content}</script>`;
}

/**
 * Create a nonce-enabled style tag
 * @param nonce The nonce value
 * @param content The CSS content
 * @returns Style tag with nonce attribute
 */
export function createNonceStyle(nonce: string, content: string): string {
  return `<style nonce="${nonce}">${content}</style>`;
}