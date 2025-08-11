import { createClient } from '@redis/client';

import { __resetClientForTests, getRedisClient } from './client';

jest.mock('@redis/client', () => ({
  createClient: jest.fn(),
}));

const mockConnect = jest.fn();
const mockClient = {
  connect: mockConnect,
};
const mockStoreName = 'mockStoreName';
const mockTestId = 'testId';
const mockSecret = 'testSecret';
const mockTenantId = 'testTenantId';
const mockConnectionString = 'rediss://:password@host:port';

describe('getRedisClient', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    __resetClientForTests(); // 🧼 reset singleton
    (createClient as jest.Mock).mockReturnValue(mockClient);
    process.env.AZURE_MANAGED_REDIS_HOST_NAME = mockStoreName;
    process.env.AZURE_MANAGED_REDIS_CLIENT_ID = mockTestId;
    process.env.AZURE_MANAGED_REDIS_CLIENT_SECRET = mockSecret;
    process.env.AZURE_MANAGED_REDIS_TENANT_ID = mockTenantId;
  });

  it('creates and connects a Redis client with entraID authentication if not already connected', async () => {
    await getRedisClient();
    expect(createClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `rediss://${mockStoreName}:10000`,
        credentialsProvider: expect.anything(),
      }),
    );
    expect(mockConnect).toHaveBeenCalled();
  });

  it('creates and connects a Redis client with a connection string', async () => {
    process.env.AZURE_REDIS_CONNECTION_STRING = mockConnectionString;
    process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY = 'true';

    await getRedisClient();
    expect(createClient).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'rediss://:password@host:port' }),
    );
    expect(mockConnect).toHaveBeenCalled();

    delete process.env.AZURE_REDIS_CONNECTION_STRING;
    delete process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY;
  });

  it('throws an error if AZURE_REDIS_CONNECTION_STRING is not set', async () => {
    process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY = 'true';

    await expect(getRedisClient()).rejects.toThrow(
      'AZURE_REDIS_CONNECTION_STRING is empty',
    );

    delete process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY;
  });

  it('throws an error if AZURE_MANAGED_REDIS_HOST_NAME is not set', async () => {
    process.env.AZURE_MANAGED_REDIS_HOST_NAME = undefined;

    await expect(getRedisClient()).rejects.toThrow(
      'AZURE_MANAGED_REDIS_HOST_NAME is empty',
    );
  });

  it('throws an error if AZURE_MANAGED_CLIENT_ID is not set', async () => {
    process.env.AZURE_MANAGED_REDIS_CLIENT_ID = undefined;

    await expect(getRedisClient()).rejects.toThrow(
      'AZURE_MANAGED_REDIS_CLIENT_ID is empty',
    );
  });

  it('throws an error if AZURE_MANAGED_CLIENT_SECRET is not set', async () => {
    process.env.AZURE_MANAGED_REDIS_CLIENT_SECRET = undefined;

    await expect(getRedisClient()).rejects.toThrow(
      'AZURE_MANAGED_REDIS_CLIENT_SECRET is empty',
    );
  });

  it('throws an error if AZURE_MANAGED_TENANT_ID is not set', async () => {
    process.env.AZURE_MANAGED_REDIS_TENANT_ID = undefined;

    await expect(getRedisClient()).rejects.toThrow(
      'AZURE_MANAGED_REDIS_TENANT_ID is empty',
    );
  });
});
