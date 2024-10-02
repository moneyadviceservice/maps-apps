//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en/pension-wise-triage/start',
        permanent: false,
      },
      {
        source: '/en',
        destination: '/en/pension-wise-triage/start',
        permanent: true,
      },
      {
        source: '/cy',
        destination: '/cy/pension-wise-triage/start',
        permanent: true,
      },
      {
        source: '/en/pension-wise-triage',
        destination: '/en/pension-wise-triage/start',
        permanent: true,
      },
      {
        source: '/cy/pension-wise-triage',
        destination: '/cy/pension-wise-triage/start',
        permanent: true,
      },
    ];
  },
  env: {
    appUrl: 'pension-wise-triage',
    toolName: 'PWD-Triage',
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
