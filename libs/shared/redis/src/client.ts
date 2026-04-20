import { createClient, RedisClientType } from '@redis/client';
import { EntraIdCredentialsProviderFactory } from '@redis/entraid';

// Promise to manage in-flight connections, preventing race conditions.
let clientPromise: Promise<RedisClientType> | null = null;

const socketConfig = {
  // Try to reconnect with a 3-second ceiling.
  reconnectStrategy: (retries: number) => Math.min(retries * 100, 3000),
};

/**
 * Creates, configures, and connects a new Redis client instance.
 * This function is called only once by getRedisClient.
 */
async function initializeClient(): Promise<RedisClientType> {
  const CONNECT_VIA_KEY = !!process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY;
  const client: RedisClientType = CONNECT_VIA_KEY
    ? getWithConnectionString()
    : getWithEntra();

  // Attach event listeners for logging and monitoring (development only).
  // The library will handle the actual reconnection logic.
  if (process.env.NODE_ENV !== 'production') {
    client.on('connect', () => console.info('Redis client connected'));
    client.on('reconnecting', () =>
      console.info('Redis client reconnecting...'),
    );
    client.on('end', () => console.warn('Redis client connection closed.'));
    client.on('error', (err) => console.error('Redis Client Error', err));
  }

  try {
    await client.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    // If the initial connection fails, reset the promise to allow retries on subsequent calls.
    clientPromise = null;
    throw err;
  }

  return client;
}

/**
 * Gets the singleton Redis client instance, creating it if it doesn't exist.
 * Handles race conditions during initial connection.
 */
export function getRedisClient(): Promise<RedisClientType> {
  if (!clientPromise) {
    clientPromise = initializeClient();
  }
  return clientPromise;
}

function getWithEntra(): RedisClientType {
  const host = process.env.AZURE_MANAGED_REDIS_HOST_NAME;
  const clientId = process.env.AZURE_MANAGED_REDIS_CLIENT_ID;
  const clientSecret = process.env.AZURE_MANAGED_REDIS_CLIENT_SECRET;
  const tenantId = process.env.AZURE_MANAGED_REDIS_TENANT_ID;

  if (!host) throw Error('AZURE_MANAGED_REDIS_HOST_NAME is empty');
  if (!clientId) throw Error('AZURE_MANAGED_REDIS_CLIENT_ID is empty');
  if (!clientSecret) throw Error('AZURE_MANAGED_REDIS_CLIENT_SECRET is empty');
  if (!tenantId) throw Error('AZURE_MANAGED_REDIS_TENANT_ID is empty');

  const provider = EntraIdCredentialsProviderFactory.createForClientCredentials(
    {
      clientId,
      clientSecret,
      authorityConfig: {
        type: 'multi-tenant',
        tenantId,
      },
      tokenManagerConfig: {
        expirationRefreshRatio: 0.8,
      },
    },
  );

  return createClient({
    url: `rediss://${host}:10000`,
    credentialsProvider: provider,
    socket: socketConfig,
  });
}

function getWithConnectionString(): RedisClientType {
  const connectionString = process.env.AZURE_REDIS_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_REDIS_CONNECTION_STRING is not set.');
  }

  return createClient({
    url: connectionString,
    socket: socketConfig,
  });
}

export function __resetClientForTests() {
  clientPromise = null;
}
