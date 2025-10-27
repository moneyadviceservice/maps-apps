//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const redirects = require('./redirects');

const serverRuntimeConfig = {
  ENVIRONMENT: process.env.AEM_HOST_PUBLIC,
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  serverRuntimeConfig,
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
        hostname: '**.moneyhelper.org.uk',
        port: '',
        pathname: '/content/dam/sfs/**',
      },
      {
        protocol: 'https',
        hostname: '**gqlhosts-qa.moneyhelper.org.uk',
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
      {
        source:
          '/:path((?!en|cy|_error|api|admin|auth|footer|favicon|apple-touch-icon|android-chrome|mstile).*)',
        destination: '/en/:path*',
        permanent: false,
      },
      ...redirects,
    ];
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
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

// Patch global.fetch only if AEM_USER_AGENT is set
if (process.env.AEM_USERAGENT && typeof fetch !== 'undefined') {
  const originalFetch = fetch;

  global.fetch = (url, options = {}) => {
    let targetUrl = null;

    if (typeof url === 'string') {
      targetUrl = new URL(url);
    } else if ('url' in url && typeof url.url === 'string') {
      targetUrl = new URL(url.url);
    } else if (url instanceof URL) {
      targetUrl = url;
    }

    if (targetUrl?.pathname.startsWith('/content/dam')) {
      options.headers = {
        ...options.headers,
        'User-Agent': process.env.AEM_USERAGENT ?? '',
      };
    }

    return originalFetch(url, options);
  };
}

module.exports = composePlugins(...plugins)(nextConfig);
