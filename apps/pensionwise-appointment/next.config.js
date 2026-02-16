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
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en/pension-wise-appointment',
        permanent: false,
      },
      {
        source: '/en',
        destination: '/en/pension-wise-appointment',
        permanent: false,
      },
    ];
  },
  env: {
    appVersion: '1',
    appUrl: 'pension-wise-appointment',
    toolName: 'PWD-Appointment',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // @adobe/aem-headless-client-nodejs fixes
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
