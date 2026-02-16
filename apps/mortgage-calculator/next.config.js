//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  withCSPHeaders,
} = require('../../libs/shared/csp-policy/src/withCSPHeaders');

const publicRuntimeConfig = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  DEV_FEEDBACK_SITE_ID: process.env.DEV_FEEDBACK_SITE_ID,
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  publicRuntimeConfig,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
  },
  webpack(config) {
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
  withCSPHeaders({ overrides: { 'frame-ancestors': '*' } }),
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
