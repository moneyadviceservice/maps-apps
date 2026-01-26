const { join } = require('node:path');
const { defaultCspHeader } = require(join(
  __dirname,
  'data',
  'defaultCspHeader.ts',
));

function shouldSkipCSP() {
  return process.env.NODE_ENV === 'development';
}

function generateCSPHeaderValue({ overrides }) {
  return Object.entries(defaultCspHeader)
    .map(([key, value]) => {
      // 1. Check for overrides first
      if (overrides[key] !== undefined) {
        return `${key} ${overrides[key]}`;
      }

      // 2. Handle 'script-src' specifically for Netlify plugin integration
      if (key === 'script-src') {
        // We only want to pass 'self' and let the Netlify plugin inject
        // the nonce and 'strict-dynamic'.
        // Note: May also need to include 'unsafe-inline' temporarily
        // for compatibility if necessary, but it's best practice to omit it
        // when using nonces/strict-dynamic.
        return `${key} 'self'`; // This can instead be set in defaultCspHeader when all apps use @netlify/plugin-csp-nonce
      }

      // 3. Use the default value for all other directives
      return `${key} ${value}`;
    })
    .join('; ');
}

/**
 * Next.js config plugin that adds CSP headers
 * @param {Object} options - Plugin options
 * @param {boolean} [options.reportOnly=true] - Use Content-Security-Policy-Report-Only header (default: true). Set to false to enforce CSP and block violations.
 * @param {Object} [options.overrides={}] - Override specific CSP directives (e.g., { 'frame-ancestors': '*' }).
 * @returns {(config: import('next').NextConfig) => import('next').NextConfig}
 */
function withCSPHeaders(options = {}) {
  const { reportOnly = true, overrides = {} } = options;

  return (nextConfig = {}) => {
    return {
      ...nextConfig,
      async headers() {
        // Get any existing headers from the app's config
        const existingHeaders = nextConfig.headers
          ? await nextConfig.headers()
          : [];

        // Skip CSP in local development
        if (shouldSkipCSP()) {
          console.log('CSP headers disabled for local development');
          return existingHeaders;
        }

        const headerKey = reportOnly
          ? 'Content-Security-Policy-Report-Only'
          : 'Content-Security-Policy';

        const cspHeaders = [
          {
            source: '/:path*',
            headers: [
              {
                key: headerKey,
                value: generateCSPHeaderValue({ overrides }),
              },
            ],
          },
        ];

        // Merge with existing headers
        return [...existingHeaders, ...cspHeaders];
      },
    };
  };
}

module.exports = { withCSPHeaders };
