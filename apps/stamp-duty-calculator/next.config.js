//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

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
        destination: '/en/sdlt',
        permanent: false,
      },
      {
        source: '/en',
        destination: '/en/sdlt',
        permanent: false,
      },
      {
        source: '/cy',
        destination: '/cy/sdlt',
        permanent: false,
      },
      {
        source: '/sdlt',
        destination: '/en/sdlt',
        permanent: false,
      },
      {
        source: '/lbtt',
        destination: '/en/lbtt',
        permanent: false,
      },
      {
        source: '/ltt',
        destination: '/en/ltt',
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
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
