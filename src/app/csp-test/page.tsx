import { getNonce } from '@/lib/nonce';

/**
 * CSP Test Page
 * This page tests the Content Security Policy implementation
 * including nonce usage for inline scripts and styles
 */
export default async function CSPTestPage() {
  const nonce = await getNonce();

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>CSP Implementation Test</h1>

      <div className='space-y-6'>
        <section className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Security Headers Test</h2>
          <p className='mb-4'>
            Open browser developer tools and check the Network tab to verify
            these headers:
          </p>
          <ul className='list-disc list-inside space-y-2 text-sm'>
            <li>
              <code>Content-Security-Policy</code> - Should include nonce values
            </li>
            <li>
              <code>X-Frame-Options: DENY</code>
            </li>
            <li>
              <code>X-Content-Type-Options: nosniff</code>
            </li>
            <li>
              <code>X-XSS-Protection: 1; mode=block</code>
            </li>
            <li>
              <code>Referrer-Policy: strict-origin-when-cross-origin</code>
            </li>
            <li>
              <code>Permissions-Policy</code>
            </li>
          </ul>
        </section>

        <section className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Nonce Test</h2>
          <p className='mb-4'>
            Current nonce value:{' '}
            <code className='bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
              {nonce}
            </code>
          </p>

          {/* Test inline script with nonce */}
          <div className='mb-4'>
            <h3 className='font-medium mb-2'>
              Inline Script Test (with nonce):
            </h3>
            <button
              id='nonce-test-btn'
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
            >
              Click to test nonce script
            </button>
            <script
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: `
                  document.addEventListener('DOMContentLoaded', function() {
                    const btn = document.getElementById('nonce-test-btn');
                    if (btn) {
                      btn.addEventListener('click', function() {
                        alert('Nonce script executed successfully!');
                      });
                    }
                  });
                `,
              }}
            />
          </div>

          {/* Test inline style with nonce */}
          <div className='mb-4'>
            <h3 className='font-medium mb-2'>
              Inline Style Test (with nonce):
            </h3>
            <div className='nonce-style-test'>
              This text should be green if nonce styles work
            </div>
            <style
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: `
                  .nonce-style-test {
                    color: #10b981;
                    font-weight: bold;
                    padding: 8px;
                    border: 2px solid #10b981;
                    border-radius: 4px;
                    display: inline-block;
                  }
                `,
              }}
            />
          </div>
        </section>

        <section className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>CSP Violation Test</h2>
          <p className='mb-4'>
            These elements should be blocked by CSP (check console for
            violations):
          </p>

          {/* This should be blocked - inline script without nonce */}
          <div className='mb-4'>
            <h3 className='font-medium mb-2 text-red-600'>
              Blocked: Inline Script (no nonce):
            </h3>
            <button className='bg-red-500 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed'>
              Blocked Script (no onClick handler)
            </button>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                // This script should be blocked by CSP (no nonce)
                // eslint-disable-next-line no-console
                console.log('This inline script should be blocked!');
                alert('This should not execute!');
              `,
              }}
            />
          </div>

          {/* This should be blocked - external script from untrusted domain */}
          <div className='mb-4'>
            <h3 className='font-medium mb-2 text-red-600'>
              Blocked: External Script (untrusted domain):
            </h3>
            <script async src='https://evil-domain.com/malicious.js'></script>
            <p className='text-sm text-gray-600'>
              External script from untrusted domain (should be blocked)
            </p>
          </div>
        </section>

        <section className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Instructions</h2>
          <ol className='list-decimal list-inside space-y-2'>
            <li>Open browser developer tools (F12)</li>
            <li>Go to Network tab and refresh the page</li>
            <li>Check response headers for security headers</li>
            <li>Go to Console tab to see any CSP violations</li>
            <li>Test the nonce script button (should work)</li>
            <li>Verify the green styled text appears</li>
            <li>Check that blocked elements generate CSP violations</li>
          </ol>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'CSP Test - Personal Blog',
  description: 'Content Security Policy implementation test page',
};
