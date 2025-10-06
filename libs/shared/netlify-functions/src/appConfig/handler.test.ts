import { getStore } from '@netlify/blobs';

import { getAppConfiguration } from '../utils/azureConfigClient';
import { appConfigHandler, AppConfigOptions } from './handler';

jest.mock('@netlify/blobs', () => ({
  getStore: jest.fn(),
}));

jest.mock('../utils/azureConfigClient', () => ({
  getAppConfiguration: jest.fn(),
}));

global.Request = jest.fn().mockImplementation((url, options) => ({
  url,
  method: options?.method || 'GET',
})) as unknown as typeof Request;

global.Response = jest.fn().mockImplementation((body, options) => ({
  json: async () => JSON.parse(body),
  status: options?.status || 200,
  headers: new Map(Object.entries(options?.headers || {})),
})) as unknown as typeof Response;

describe('appConfigHandler', () => {
  const originalEnv = process.env;

  const mockContext = {
    params: {},
    json: jest.fn(),
    account: {},
    cookies: {},
    deploy: {},
    geo: {},
    next: jest.fn(),
    site: {},
  } as any;
  const mockOptions: AppConfigOptions = {
    appName: 'test-app',
  };
  const mockFeatureFlags = [
    {
      id: 'enableBanner',
      enabled: false,
      description: '',
      conditions: {
        clientFilters: [],
      },
    },
  ];
  const mockConfigSettings = [
    {
      value: '33',
      key: 'interestRateValue',
      label: 'mortgage-calculator',
      lastModified: '2025-03-21T19:37:45.000Z',
      tags: {},
      etag: '6ZgfRoXAo6e6iQ73ykBxTRNWyipp2rB0tRSGqlpK3JA',
      isReadOnly: false,
    },
  ];
  const mockConfigData = {
    featureFlags: mockFeatureFlags,
    configurationSettings: mockConfigSettings,
  };

  const mockGetWithMetadata = jest.fn();
  const mockSetJSON = jest.fn();
  const mockStore = {
    getWithMetadata: mockGetWithMetadata,
    setJSON: mockSetJSON,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to clean environment
    process.env = { ...originalEnv };

    (getStore as jest.Mock).mockReturnValue(mockStore);
    (getAppConfiguration as jest.Mock).mockResolvedValue(mockConfigData);
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should return cached data when valid cache exists', async () => {
    const now = Date.now();
    const cachedData = {
      data: mockConfigData,
      metadata: {
        timestamp: now - 1000, // 1 second ago (still valid)
      },
    };
    mockGetWithMetadata.mockResolvedValue(cachedData);

    const request = new Request('https://example.com/config', {
      method: 'GET',
    });

    const response = await appConfigHandler(request, mockContext, mockOptions);
    const responseData = await response.json();

    expect(mockGetWithMetadata).toHaveBeenCalledWith(
      'test-app-staging-config-cache',
      {
        type: 'json',
      },
    );
    expect(mockSetJSON).not.toHaveBeenCalled();
    expect(getAppConfiguration).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(responseData).toEqual(mockConfigData);
  });

  it.each([
    {
      name: 'expired cache',
      cachedData: {
        data: { ...mockConfigData, oldData: true },
        metadata: {
          timestamp: Date.now() - 6 * 60 * 1000, // 6 minutes ago (expired)
        },
      },
    },
    {
      name: 'no cache',
      cachedData: null,
    },
  ])('should fetch fresh data when $name exists', async ({ cachedData }) => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    (getAppConfiguration as jest.Mock).mockResolvedValue(mockConfigData);

    mockGetWithMetadata.mockResolvedValue(cachedData);

    const request = new Request('https://example.com/config', {
      method: 'GET',
    });

    const response = await appConfigHandler(request, mockContext, mockOptions);
    const responseData = await response.json();

    expect(mockGetWithMetadata).toHaveBeenCalledWith(
      'test-app-staging-config-cache',
      {
        type: 'json',
      },
    );
    expect(getAppConfiguration).toHaveBeenCalledWith('test-app-staging');
    expect(mockSetJSON).toHaveBeenCalledWith(
      'test-app-staging-config-cache',
      mockConfigData,
      expect.objectContaining({
        metadata: expect.objectContaining({
          timestamp: expect.any(Number),
        }),
      }),
    );
    expect(response.status).toBe(200);
    expect(responseData).toEqual(mockConfigData);

    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors when fetching configuration fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockGetWithMetadata.mockResolvedValue(null);
    const errorMessage = 'Failed to fetch config';
    const error = new Error(errorMessage);
    (getAppConfiguration as jest.Mock).mockRejectedValue(error);

    const request = new Request('https://example.com/config', {
      method: 'GET',
    });

    const response = await appConfigHandler(request, mockContext, mockOptions);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      error: `Failed to retrieve configuration for test-app-staging`,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Failed to retrieve configuration for test-app-staging:`,
      error,
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle non-GET requests with 405 Method Not Allowed', async () => {
    const request = new Request('https://example.com/config', {
      method: 'POST',
    });

    const response = await appConfigHandler(request, mockContext, mockOptions);

    expect(response.status).toBe(405);
  });

  it('should use custom options when provided', async () => {
    mockGetWithMetadata.mockResolvedValue(null);

    const customOptions: AppConfigOptions = {
      appName: 'custom-app',
      cacheKey: 'custom-cache-key',
      cacheTtlMs: 10000, // 10 seconds
      blobStoreName: 'custom-store',
    };

    const request = new Request('https://example.com/config', {
      method: 'GET',
    });

    await appConfigHandler(request, mockContext, customOptions);

    expect(getStore).toHaveBeenCalledWith('custom-store');
    expect(mockGetWithMetadata).toHaveBeenCalledWith('custom-cache-key', {
      type: 'json',
    });
    expect(getAppConfiguration).toHaveBeenCalledWith('custom-app-staging');
  });

  describe('environment-aware label selection', () => {
    it('should use production label when CONTEXT is production', async () => {
      process.env.CONTEXT = 'production';
      mockGetWithMetadata.mockResolvedValue(null);

      const request = new Request('https://example.com/config', {
        method: 'GET',
      });

      await appConfigHandler(request, mockContext, mockOptions);

      expect(getAppConfiguration).toHaveBeenCalledWith('test-app-production');
    });

    it('should use staging label for non-production environments', async () => {
      process.env.CONTEXT = 'deploy-preview';
      process.env.BRANCH = 'feature-branch';
      mockGetWithMetadata.mockResolvedValue(null);

      const request = new Request('https://example.com/config', {
        method: 'GET',
      });

      await appConfigHandler(request, mockContext, mockOptions);

      expect(getAppConfiguration).toHaveBeenCalledWith('test-app-staging');
      expect(mockGetWithMetadata).toHaveBeenCalledWith(
        'test-app-staging-config-cache',
        {
          type: 'json',
        },
      );
    });

    it('should respect useEnvironmentLabel option when set to false', async () => {
      process.env.NETLIFY_ENV = 'production';
      mockGetWithMetadata.mockResolvedValue(null);

      const customOptions: AppConfigOptions = {
        appName: 'test-app',
        useEnvironmentLabel: false,
      };

      const request = new Request('https://example.com/config', {
        method: 'GET',
      });

      await appConfigHandler(request, mockContext, customOptions);

      // Should use appName directly without environment suffix
      expect(getAppConfiguration).toHaveBeenCalledWith('test-app');
      expect(mockGetWithMetadata).toHaveBeenCalledWith(
        'test-app-config-cache',
        {
          type: 'json',
        },
      );
    });
  });
});
