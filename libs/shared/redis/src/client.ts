import { createClient, RedisClientType } from '@redis/client';
import { EntraIdCredentialsProviderFactory } from '@redis/entraid';

let client: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  const connectViaKey = !!process.env.AZURE_MANAGED_REDIS_CONNECT_VIA_KEY;

  if (!client) {
    if (connectViaKey) {
      client = await getWithConnectionString();
    } else {
      client = await getWithEntra();
    }

    try {
      await client.connect();
    } catch (err) {
      console.error('Redis connection failed:', err);
      throw err;
    }
  }

  return client;
}

export async function getWithEntra(): Promise<RedisClientType> {
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
  });
}

export async function getWithConnectionString(): Promise<RedisClientType> {
  const redisUrl = process.env.AZURE_REDIS_CONNECTION_STRING;

  if (!redisUrl) throw Error('AZURE_REDIS_CONNECTION_STRING is empty');

  return createClient({
    url: redisUrl,
  });
}

export function __resetClientForTests() {
  client = null;
}
