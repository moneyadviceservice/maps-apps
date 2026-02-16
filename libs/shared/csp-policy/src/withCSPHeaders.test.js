const { withCSPHeaders } = require('./withCSPHeaders');

// Mock the defaultCspHeader
jest.mock('./data/defaultCspHeader.ts', () => ({
  defaultCspHeader: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-eval'",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data:",
    'frame-ancestors': "'none'",
  },
}));

describe('withCSPHeaders', () => {
  let originalEnv;

  beforeEach(() => {
    // Store original environment
    originalEnv = process.env;
    // Reset environment for each test
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('plugin configuration', () => {
    it('should return a function that wraps Next.js config', () => {
      const plugin = withCSPHeaders();
      expect(typeof plugin).toBe('function');
    });

    it('should preserve existing Next.js config properties', async () => {
      const plugin = withCSPHeaders();
      const existingConfig = {
        reactStrictMode: true,
        swcMinify: true,
        publicRuntimeConfig: { foo: 'bar' },
      };

      const wrappedConfig = plugin(existingConfig);

      expect(wrappedConfig.reactStrictMode).toBe(true);
      expect(wrappedConfig.swcMinify).toBe(true);
      expect(wrappedConfig.publicRuntimeConfig).toEqual({ foo: 'bar' });
    });
  });

  describe('CSP header generation in production', () => {
    beforeEach(() => {
      // Set production environment
      process.env.NODE_ENV = 'production';
      process.env.ENVIRONMENT = 'production';
    });

    it('should add Content-Security-Policy-Report-Only header by default', async () => {
      const expectedCspValue =
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'";
      const expectedHeader = {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy-Report-Only',
            value: expectedCspValue,
          },
        ],
      };

      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0]).toEqual(expectedHeader);
    });

    it('should add Content-Security-Policy header when reportOnly is false', async () => {
      const expectedCspValue =
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'";
      const expectedHeader = {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: expectedCspValue,
          },
        ],
      };

      const plugin = withCSPHeaders({ reportOnly: false });
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0]).toEqual(expectedHeader);
    });

    it('should merge with existing headers from app config', async () => {
      const customHeader = { key: 'X-Custom-Header', value: 'custom-value' };
      const existingHeaders = [
        {
          source: '/api/:path*',
          headers: [customHeader],
        },
      ];
      const headersFunction = async () => existingHeaders;

      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({ headers: headersFunction });

      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(2);
      expect(headers[0]).toEqual(existingHeaders[0]);
      expect(headers[1].source).toBe('/:path*');
      expect(headers[1].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });

    it('should handle config without existing headers function', async () => {
      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({ reactStrictMode: true });
      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });
  });

  describe('local development environment detection', () => {
    it('should skip CSP when NODE_ENV is development', async () => {
      process.env.NODE_ENV = 'development';

      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(0);
    });

    it('should preserve existing headers even when CSP is skipped in development', async () => {
      process.env.NODE_ENV = 'development';

      const customHeader = { key: 'X-Custom-Header', value: 'custom-value' };
      const existingHeaders = [
        {
          source: '/api/:path*',
          headers: [customHeader],
        },
      ];
      const headersFunction = async () => existingHeaders;

      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({ headers: headersFunction });

      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0]).toEqual(existingHeaders[0]);
    });

    it('should apply CSP in staging environment', async () => {
      process.env.NODE_ENV = 'production';
      process.env.ENVIRONMENT = 'staging';

      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });

    it('should apply CSP in integration environment', async () => {
      process.env.NODE_ENV = 'production';
      process.env.ENVIRONMENT = 'integration';

      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });
  });

  describe('plugin options', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.ENVIRONMENT = 'production';
    });

    it('should default reportOnly to true', async () => {
      const plugin = withCSPHeaders({});
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });

    it('should handle empty options object', async () => {
      const plugin = withCSPHeaders({});
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });

    it('should handle undefined options', async () => {
      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });

    it('should handle undefined nextConfig', async () => {
      const plugin = withCSPHeaders();
      const wrappedConfig = plugin();
      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });

    it('should use enforcement mode when reportOnly is false', async () => {
      const plugin = withCSPHeaders({ reportOnly: false });
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers[0].headers[0].key).toBe('Content-Security-Policy');
    });
  });

  describe('CSP header value formatting', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.ENVIRONMENT = 'production';
    });

    it('should format CSP directives with semicolon separation', async () => {
      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      const cspValue = headers[0].headers[0].value;
      const directives = cspValue.split('; ');

      expect(directives).toHaveLength(5);
      expect(directives[0]).toBe("default-src 'self'");
      expect(directives[1]).toBe("script-src 'self'");
      expect(directives[2]).toBe("style-src 'self' 'unsafe-inline'");
      expect(directives[3]).toBe("img-src 'self' data:");
      expect(directives[4]).toBe("frame-ancestors 'none'");
    });

    it('should apply CSP to all routes', async () => {
      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers[0].source).toBe('/:path*');
    });
  });

  describe('reportOnly option behavior', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.ENVIRONMENT = 'production';
    });

    it('should respect reportOnly option in development (still skips CSP)', async () => {
      process.env.NODE_ENV = 'development';

      const plugin = withCSPHeaders({ reportOnly: true });
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      // CSP should be skipped in development regardless of reportOnly
      expect(headers).toHaveLength(0);
    });

    it('should allow switching between enforcing and report-only modes', async () => {
      const enforcingPlugin = withCSPHeaders({ reportOnly: false });
      const reportOnlyPlugin = withCSPHeaders({ reportOnly: true });

      const enforcingConfig = enforcingPlugin({});
      const reportOnlyConfig = reportOnlyPlugin({});

      const enforcingHeaders = await enforcingConfig.headers();
      const reportOnlyHeaders = await reportOnlyConfig.headers();

      expect(enforcingHeaders[0].headers[0].key).toBe(
        'Content-Security-Policy',
      );
      expect(reportOnlyHeaders[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });
  });

  describe('overrides option behavior', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.ENVIRONMENT = 'production';
    });

    it('should override frame-ancestors when specified', async () => {
      const plugin = withCSPHeaders({ overrides: { 'frame-ancestors': '*' } });
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      const cspValue = headers[0].headers[0].value;

      expect(cspValue).toContain('frame-ancestors *');
      expect(cspValue).not.toContain("frame-ancestors 'none'");
    });

    it('should override multiple directives', async () => {
      const plugin = withCSPHeaders({
        overrides: {
          'frame-ancestors': '*',
          'img-src': "'self' example.com",
        },
      });
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      const cspValue = headers[0].headers[0].value;

      expect(cspValue).toContain('frame-ancestors *');
      expect(cspValue).toContain("img-src 'self' example.com");
    });

    it('should use defaults when no overrides provided', async () => {
      const plugin = withCSPHeaders({});
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      const cspValue = headers[0].headers[0].value;

      expect(cspValue).toContain("frame-ancestors 'none'");
    });

    it('should work with reportOnly option', async () => {
      const plugin = withCSPHeaders({
        overrides: { 'frame-ancestors': '*' },
        reportOnly: false,
      });
      const wrappedConfig = plugin({});
      const headers = await wrappedConfig.headers();

      expect(headers[0].headers[0].key).toBe('Content-Security-Policy');
      expect(headers[0].headers[0].value).toContain('frame-ancestors *');
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.ENVIRONMENT = 'production';
    });

    it('should handle async headers function that returns a promise', async () => {
      const testHeader = { key: 'X-Test', value: 'test' };
      const customHeaders = [
        {
          source: '/custom',
          headers: [testHeader],
        },
      ];

      const delayedResolve = () => Promise.resolve(customHeaders);

      const headersFunction = async () => delayedResolve();

      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({ headers: headersFunction });

      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(2);
      expect(headers[0].source).toBe('/custom');
      expect(headers[1].source).toBe('/:path*');
    });

    it('should handle existing headers function that returns empty array', async () => {
      const headersFunction = async () => [];

      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({ headers: headersFunction });

      const headers = await wrappedConfig.headers();

      expect(headers).toHaveLength(1);
      expect(headers[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });
  });

  describe('plugin composition', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.ENVIRONMENT = 'production';
    });

    it('should work with composePlugins pattern', async () => {
      const mockWithNx = (config) => ({
        ...config,
        nx: { svgr: false },
      });

      const plugin = withCSPHeaders();

      // Simulate composePlugins([withCSPHeaders(), withNx])(nextConfig)
      const nextConfig = { reactStrictMode: true };
      const withCSP = plugin(nextConfig);
      const finalConfig = mockWithNx(withCSP);

      expect(finalConfig.reactStrictMode).toBe(true);
      expect(finalConfig.nx).toEqual({ svgr: false });
      expect(typeof finalConfig.headers).toBe('function');

      const headers = await finalConfig.headers();
      expect(headers).toHaveLength(1);
      expect(headers[0].headers[0].key).toBe(
        'Content-Security-Policy-Report-Only',
      );
    });

    it('should preserve other Next.js config functions when not provided', () => {
      const plugin = withCSPHeaders();
      const wrappedConfig = plugin({
        webpack: (config) => config,
        env: { CUSTOM_VAR: 'value' },
      });

      expect(typeof wrappedConfig.webpack).toBe('function');
      expect(wrappedConfig.env).toEqual({ CUSTOM_VAR: 'value' });
      expect(typeof wrappedConfig.headers).toBe('function');
    });
  });
});
