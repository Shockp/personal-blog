'use client';

import { useEffect } from 'react';
import { useNonce } from '@/hooks/useNonce';

export default function ThemeScript() {
  const nonce = useNonce();

  useEffect(() => {
    // Theme initialization logic
    try {
      const savedTheme = localStorage.getItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const theme = savedTheme || systemTheme;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Ignore errors
    }
  }, []);

  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var savedTheme = localStorage.getItem('theme');
              var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              var theme = savedTheme || systemTheme;
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}