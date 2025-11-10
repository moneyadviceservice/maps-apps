const { join } = require('node:path');
const { defaultCspHeader } = require(join(
  __dirname,
  'data',
  'defaultCspHeader.ts',
));

function shouldSkipCSP() {
  return process.env.NODE_ENV === 'development';
}

function generateCSPHeaderValue() {
  return Object.entries(defaultCspHeader)
    .filter(([key]) => key !== 'script-src')
    .map(([key, value]) => `${key} ${value}`)
    .join('; ');
}

/**
 * Next.js config plugin that adds CSP headers
 * @param {Object} options - Plugin options
 * @param {boolean} [options.reportOnly=true] - Use Content-Security-Policy-Report-Only header (default: true). Set to false to enforce CSP and block violations.
 * @returns {(config: import('next').NextConfig) => import('next').NextConfig}
 */
function withCSPHeaders(options = {}) {
  const { reportOnly = true } = options;

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
                value: generateCSPHeaderValue(),
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
