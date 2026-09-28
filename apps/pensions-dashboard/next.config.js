//@ts-check

const { composePlugins, withNx } = require('@nx/next');

const {
  withCSPHeaders,
} = require('../../libs/shared/csp-policy/src/withCSPHeaders');
const path = require('node:path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-*/**/*',
      'node_modules/@swc/core/**/*',
      'node_modules/@rspack/**/*',
      'node_modules/@esbuild/**/*',
      'node_modules/esbuild/**/*',
      'node_modules/webpack/**/*',
      'node_modules/sass/**/*',
      'node_modules/sass-embedded*/**/*',
      'node_modules/sass-loader/**/*',
      'node_modules/typescript/**/*',
      'node_modules/terser/**/*',
      'node_modules/uglify-js/**/*',
      'node_modules/csso/**/*',
      'node_modules/clean-css/**/*',
      'node_modules/caniuse-lite/**/*',
      'node_modules/next/dist/compiled/@ampproject/**/*',
      'node_modules/next/dist/compiled/webpack/**/*',
      'node_modules/next/dist/compiled/terser/**/*',
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/api',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/api/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)', // apply to all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none', // Required for Adobe Launch compatibility
          },
        ],
      },
    ];
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@maps-public': path.join(__dirname, 'public'),
    };

    // Configures webpack to handle SVG files with SVGR. SVGR optimizes and transforms SVG files
    // into React components. See https://react-svgr.com/docs/next/

    // Grab the existing rule that handles SVG imports
    // @ts-expect-error - rules is a private property that is not typed
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withCSPHeaders({
    reportOnly:
      process.env.CONTEXT !== 'production' &&
      process.env.CONTEXT !== 'branch:staging',
    overrides: {
      'frame-ancestors': '*',
    },
  }),
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
