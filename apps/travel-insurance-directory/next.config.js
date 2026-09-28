//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const path = require('node:path');
const {
  withCSPHeaders,
} = require('../../libs/shared/csp-policy/src/withCSPHeaders');

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
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.adobecqms.net',
        port: '',
        pathname: '/content/dam/**',
      },
      {
        protocol: 'https',
        hostname: 'moneyhelper.org.uk',
        port: '',
        pathname: '/content/dam/sfs/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
  nx: {},
  // Never colocate *.test.ts files under pages/ — Next.js registers them as API routes in production.
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@maps-public': path.join(__dirname, 'public'),
    };

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withCSPHeaders({
    reportOnly: false,
    overrides: {
      'frame-ancestors': '*',
    },
  }),
];

module.exports = composePlugins(...plugins)(nextConfig);
