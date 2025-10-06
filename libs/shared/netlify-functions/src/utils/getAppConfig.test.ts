import { AppConfiguration } from './azureConfigClient';
import * as appConfig from './getAppConfig';

global.fetch = jest.fn();
console.error = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getAppConfig', () => {
  const mockConfig: AppConfiguration = {
    featureFlags: [
      { id: 'test-flag', enabled: true, conditions: { clientFilters: [] } },
    ],
    configurationSettings: [
      {
        key: 'test-key',
        value: 'test-value',
        isReadOnly: false,
        lastModified: new Date(),
      },
    ],
  };

  it('should fetch app config from the default API path', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockConfig),
    });

    const config = await appConfig.getAppConfig('https://example.com');

    expect(fetch).toHaveBeenCalledWith('https://example.com/api/appconfig');
    expect(config).toEqual(mockConfig);
  });

  it('should fetch app config from a custom API path', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockConfig),
    });

    const config = await appConfig.getAppConfig(
      'https://example.com',
      '/api/custom-path',
    );

    expect(fetch).toHaveBeenCalledWith('https://example.com/api/custom-path');
    expect(config).toEqual(mockConfig);
  });

  it('should work with different base URLs', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockConfig),
    });

    const config = await appConfig.getAppConfig('https://preview.example.com');

    expect(fetch).toHaveBeenCalledWith(
      'https://preview.example.com/api/appconfig',
    );
    expect(config).toEqual(mockConfig);
  });

  it('should handle localhost URLs', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockConfig),
    });

    const config = await appConfig.getAppConfig('http://localhost:4200');

    expect(fetch).toHaveBeenCalledWith('http://localhost:4200/api/appconfig');
    expect(config).toEqual(mockConfig);
  });

  it('should throw an error when the API response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const config = await appConfig.getAppConfig('https://example.com');

    expect(console.error).toHaveBeenCalled();
    expect(config).toEqual({ featureFlags: [], configurationSettings: [] });
  });

  it('should return default values when fetch throws an error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const config = await appConfig.getAppConfig('https://example.com');

    expect(console.error).toHaveBeenCalled();
    expect(config).toEqual({ featureFlags: [], configurationSettings: [] });
  });
});

describe('getFeatureFlag', () => {
  const mockConfig: AppConfiguration = {
    featureFlags: [
      { id: 'flag1', enabled: true, conditions: { clientFilters: [] } },
      { id: 'flag2', enabled: false, conditions: { clientFilters: [] } },
    ],
    configurationSettings: [],
  };

  it('should return the feature flag when it exists', () => {
    const flag = appConfig.getFeatureFlag(mockConfig, 'flag1');
    expect(flag).toEqual({
      id: 'flag1',
      enabled: true,
      conditions: { clientFilters: [] },
    });
  });

  it('should return undefined when the feature flag does not exist', () => {
    const flag = appConfig.getFeatureFlag(mockConfig, 'non-existent');
    expect(flag).toBeUndefined();
  });
});

describe('isFeatureEnabled', () => {
  const mockConfig: AppConfiguration = {
    featureFlags: [
      { id: 'enabled-flag', enabled: true, conditions: { clientFilters: [] } },
      {
        id: 'disabled-flag',
        enabled: false,
        conditions: { clientFilters: [] },
      },
    ],
    configurationSettings: [],
  };

  it('should return true for an enabled feature flag', () => {
    const isEnabled = appConfig.isFeatureEnabled(mockConfig, 'enabled-flag');
    expect(isEnabled).toBe(true);
  });

  it('should return false for a disabled feature flag', () => {
    const isEnabled = appConfig.isFeatureEnabled(mockConfig, 'disabled-flag');
    expect(isEnabled).toBe(false);
  });

  it('should return false when the feature flag does not exist', () => {
    const isEnabled = appConfig.isFeatureEnabled(mockConfig, 'non-existent');
    expect(isEnabled).toBe(false);
  });
});

describe('getConfigValue', () => {
  const mockConfig: AppConfiguration = {
    featureFlags: [],
    configurationSettings: [
      {
        key: 'string-key',
        value: 'string-value',
        isReadOnly: false,
        lastModified: new Date(),
      },
      {
        key: 'number-key',
        value: '42',
        isReadOnly: false,
        lastModified: new Date(),
      },
    ],
  };

  it('should return the config value when it exists', () => {
    const value = appConfig.getConfigValue(mockConfig, 'string-key');
    expect(value).toBe('string-value');
  });

  it('should return undefined when the config key does not exist', () => {
    const value = appConfig.getConfigValue(mockConfig, 'non-existent');
    expect(value).toBeUndefined();
  });
});

describe('getNumberConfigValue', () => {
  const mockConfig: AppConfiguration = {
    featureFlags: [],
    configurationSettings: [
      {
        key: 'valid-number',
        value: '42',
        isReadOnly: false,
        lastModified: new Date(),
      },
      {
        key: 'invalid-number',
        value: 'not-a-number',
        isReadOnly: false,
        lastModified: new Date(),
      },
    ],
  };

  it('should return the numeric value when the config exists and is a valid number', () => {
    const value = appConfig.getNumberConfigValue(mockConfig, 'valid-number', 0);
    expect(value).toBe(42);
  });

  it('should return NaN when the config exists but is not a valid number', () => {
    const value = appConfig.getNumberConfigValue(
      mockConfig,
      'invalid-number',
      0,
    );
    expect(value).toBeNaN();
  });

  it('should return the default value when the config does not exist', () => {
    const value = appConfig.getNumberConfigValue(
      mockConfig,
      'non-existent',
      100,
    );
    expect(value).toBe(100);
  });
});

describe('constructURL', () => {
  it('should use x-forwarded-proto when available', () => {
    const mockReq = {
      headers: {
        host: 'example.com',
        'x-forwarded-proto': 'https',
      },
    };

    const url = appConfig.constructURL(mockReq);
    expect(url).toBe('https://example.com');
  });

  it('should default to http when x-forwarded-proto is not set', () => {
    const mockReq = {
      headers: {
        host: 'example.com',
      },
    };

    const url = appConfig.constructURL(mockReq);
    expect(url).toBe('http://example.com');
  });

  it('should handle localhost with custom port', () => {
    const mockReq = {
      headers: {
        host: 'localhost:4200',
      },
    };

    const url = appConfig.constructURL(mockReq);
    expect(url).toBe('http://localhost:4200');
  });

  it('should handle production domains with x-forwarded-proto', () => {
    const mockReq = {
      headers: {
        host: 'my-app.netlify.app',
        'x-forwarded-proto': 'https',
      },
    };

    const url = appConfig.constructURL(mockReq);
    expect(url).toBe('https://my-app.netlify.app');
  });
});
