#!/usr/bin/env node

/**
 * CSP Testing Script
 * Tests Content Security Policy implementation by checking headers
 */

/* eslint-disable no-console */

import https from 'https';
import http from 'http';

const testUrl = process.env.TEST_URL || 'http://localhost:3001';

console.log('🔒 Testing CSP Implementation');
console.log('📍 Target URL:', testUrl);
console.log('\n' + '='.repeat(50));

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', err => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testCSP() {
  try {
    console.log('🚀 Making request to test CSP headers...');
    const response = await makeRequest(testUrl);

    console.log('✅ Response Status:', response.statusCode);
    console.log('\n📋 Security Headers Analysis:');
    console.log('-'.repeat(40));

    // Check for CSP header
    const csp = response.headers['content-security-policy'];
    if (csp) {
      console.log('✅ Content-Security-Policy:', csp.substring(0, 100) + '...');

      // Check for nonce in CSP
      if (csp.includes('nonce-')) {
        console.log('✅ Nonce detected in CSP');
      } else {
        console.log('⚠️  No nonce found in CSP (expected in production)');
      }
    } else {
      console.log('❌ Content-Security-Policy header missing');
    }

    // Check other security headers
    const securityHeaders = {
      'x-frame-options': 'X-Frame-Options',
      'x-content-type-options': 'X-Content-Type-Options',
      'x-xss-protection': 'X-XSS-Protection',
      'referrer-policy': 'Referrer-Policy',
      'permissions-policy': 'Permissions-Policy',
      'strict-transport-security': 'Strict-Transport-Security',
    };

    Object.entries(securityHeaders).forEach(([headerKey, headerName]) => {
      const value = response.headers[headerKey];
      if (value) {
        console.log(`✅ ${headerName}:`, value);
      } else {
        console.log(`❌ ${headerName}: Missing`);
      }
    });

    // Check for nonce in HTML
    console.log('\n🔍 Checking HTML for nonce usage...');
    if (response.body.includes('nonce=')) {
      const nonceMatches = response.body.match(/nonce="([^"]+)"/g);
      if (nonceMatches) {
        console.log(
          '✅ Nonce found in HTML:',
          nonceMatches.length,
          'occurrences'
        );
        console.log('   Example:', nonceMatches[0]);
      }
    } else {
      console.log('⚠️  No nonce attributes found in HTML');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 CSP Test Complete!');
  } catch (error) {
    console.error('❌ Error testing CSP:', error.message);
    process.exit(1);
  }
}

// Run the test
testCSP();
