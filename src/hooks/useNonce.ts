'use client';

import { useEffect, useState } from 'react';

/**
 * Generate a cryptographically secure nonce for client-side use
 * @returns A base64-encoded nonce string
 */
function generateClientNonce(): string {
  // Use Web Crypto API for client-side nonce generation
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  // Fallback for environments without crypto
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < 22; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Hook to get nonce for client-side components
 * This is primarily for client components that need to render inline scripts/styles
 */
export function useNonce(): string {
  const [nonce, setNonce] = useState<string>('');

  useEffect(() => {
    // Try to get nonce from meta tag (if set by server)
    const metaNonce = document
      .querySelector('meta[name="csp-nonce"]')
      ?.getAttribute('content');

    if (metaNonce) {
      setNonce(metaNonce);
    } else {
      // Fallback: generate client-side nonce
      // Note: This won't match server CSP, so should be avoided in production
      setNonce(generateClientNonce());
    }
  }, []);

  return nonce;
}

/**
 * Hook to create nonce-enabled script element
 */
export function useNonceScript(content: string): HTMLScriptElement | null {
  const nonce = useNonce();
  const [scriptElement, setScriptElement] = useState<HTMLScriptElement | null>(
    null
  );

  useEffect(() => {
    if (!nonce || !content) return;

    const script = document.createElement('script');
    script.nonce = nonce;
    script.textContent = content;
    setScriptElement(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [nonce, content]);

  return scriptElement;
}

/**
 * Hook to create nonce-enabled style element
 */
export function useNonceStyle(content: string): HTMLStyleElement | null {
  const nonce = useNonce();
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(
    null
  );

  useEffect(() => {
    if (!nonce || !content) return;

    const style = document.createElement('style');
    style.nonce = nonce;
    style.textContent = content;
    setStyleElement(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [nonce, content]);

  return styleElement;
}
