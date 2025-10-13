import { getRedisClient } from './client';

/**
 * Gets a value from Redis by key.
 * @param key The key to retrieve the value for.
 * @returns The value associated with the key, or null if not found.
 */
export async function redisGet(key: string): Promise<string | null> {
  const client = await getRedisClient();
  return client.get(key);
}

/**
 * Sets a key-value pair in Redis.
 * Used to create or update a record. e.g. store initialation of a form entry.
 * If the key already exists, it will overwrite the existing value.
 * If the key does not exist, it will create a new key-value pair.
 * If ttlSeconds is provided it will expire based on this value.
 * @param key
 * @param value
 * @param ttlSeconds
 * @returns
 */
export async function redisSet(
  key: string,
  value: string,
  ttlSeconds = 3600, // Set default expiration to 1 hour
): Promise<string | null> {
  const client = await getRedisClient();

  return client.set(key, value, {
    EX: ttlSeconds,
  });
}

/**
 * Deletes a key from Redis.
 * @param key
 * @returns
 */
export async function redisDel(key: string): Promise<number> {
  const client = await getRedisClient();
  return client.del(key);
}
