import { createClient } from '@redis/client';

import { __resetClientForTests, getRedisClient } from './client';

const mockConnect = jest.fn();
const mockOn = jest.fn();
const mockClient = {
  connect: mockConnect,
  on: mockOn,
};

jest.mock('@redis/client', () => ({
  createClient: jest.fn(),
}));

describe('getRedisClient', () => {
  const originalEnv = process.env;

  const mockHost = 'mock-host.redis.cache.windows.net';
  const mockClientId = 'mock-client-id';
  const mockClientSecret = 'mock-client-secret';
  const mockTenantId = 'mock-tenant-id';
  const mockConnectionString = 'rediss://:password@host:port';

  beforeEach(() => {
    jest.clearAllMocks();
    __resetClientForTests();

    process.env = { ...originalEnv };

    (createClient as jest.Mock).mockReturnValue(mockClient);
  });

  describe('Successful Connection', () => {
    it('creates and connects a Redis client using entraID', async () => {
      process.env.AZURE_MANAGED_REDIS_HOST_NAME = mockHost;
      process.env.AZURE_MANAGED_REDIS_CLIENT_ID = mockClientId;
      process.env.AZURE_MANAGED_REDIS_CLIENT_SECRET = mockClientSecret;
      process.env.AZURE_MANAGED_REDIS_TENANT_ID = mockTenantId;

      await getRedisClient();

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(createClient).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `rediss://${mockHost}:10000`,
          credentialsProvider: expect.anything(),
        }),
      );
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('creates and connects a Redis client with a connection string', async () => {
      process.env.AZURE_REDIS_CONNECTION_STRING = mockConnectionString;
      process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY = 'true';

      await getRedisClient();

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(createClient).toHaveBeenCalledWith(
        expect.objectContaining({ url: mockConnectionString }),
      );
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Singleton Behavior', () => {
    it('should only create the client once, even if called multiple times', async () => {
      process.env.AZURE_REDIS_CONNECTION_STRING = mockConnectionString;
      process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY = 'true';

      // Call getRedisClient twice without waiting
      const client1 = getRedisClient();
      const client2 = getRedisClient();

      // Wait for both promises to resolve
      const [resolvedClient1, resolvedClient2] = await Promise.all([
        client1,
        client2,
      ]);

      // Assert that both resolve to the exact same client instance
      expect(resolvedClient1).toBe(resolvedClient2);

      // Assert that the setup was only run once
      expect(createClient).toHaveBeenCalledTimes(1);
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it.each([
      [
        'AZURE_MANAGED_REDIS_HOST_NAME',
        'AZURE_MANAGED_REDIS_HOST_NAME is empty',
      ],
      [
        'AZURE_MANAGED_REDIS_CLIENT_ID',
        'AZURE_MANAGED_REDIS_CLIENT_ID is empty',
      ],
      [
        'AZURE_MANAGED_REDIS_CLIENT_SECRET',
        'AZURE_MANAGED_REDIS_CLIENT_SECRET is empty',
      ],
      [
        'AZURE_MANAGED_REDIS_TENANT_ID',
        'AZURE_MANAGED_REDIS_TENANT_ID is empty',
      ],
    ])(
      'should throw an error if %s is not set',
      async (envVarToUnset, expectedError) => {
        process.env.AZURE_MANAGED_REDIS_HOST_NAME = mockHost;
        process.env.AZURE_MANAGED_REDIS_CLIENT_ID = mockClientId;
        process.env.AZURE_MANAGED_REDIS_CLIENT_SECRET = mockClientSecret;
        process.env.AZURE_MANAGED_REDIS_TENANT_ID = mockTenantId;

        process.env[envVarToUnset] = undefined;

        await expect(getRedisClient()).rejects.toThrow(expectedError);
      },
    );

    it('should throw an error if connecting via key and the connection string is missing', async () => {
      process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY = 'true';

      await expect(getRedisClient()).rejects.toThrow(
        'AZURE_REDIS_CONNECTION_STRING is not set.',
      );
    });

    it('should allow a new connection attempt after an initial failure', async () => {
      process.env.AZURE_REDIS_CONNECTION_STRING = mockConnectionString;
      process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY = 'true';

      // First attempt: Simulate a connection failure
      mockConnect.mockRejectedValueOnce(new Error('Connection timed out'));

      await expect(getRedisClient()).rejects.toThrow('Connection timed out');

      // Verify setup was attempted
      expect(createClient).toHaveBeenCalledTimes(1);
      expect(mockConnect).toHaveBeenCalledTimes(1);

      // Second attempt: Simulate a successful connection
      mockConnect.mockResolvedValueOnce(undefined); // Fix the connection for the retry

      await getRedisClient();

      // Verify the setup was attempted again
      expect(createClient).toHaveBeenCalledTimes(2);
      expect(mockConnect).toHaveBeenCalledTimes(2);
    });
  });
});
