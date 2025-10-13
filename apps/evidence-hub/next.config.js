//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
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
  nx: {
    svgr: false,
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
