import { getStore } from '@netlify/blobs';
import { Context } from '@netlify/functions';

import {
  AppConfiguration,
  getAppConfiguration,
} from '../utils/azureConfigClient';

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

export interface AppConfigOptions {
  appName: string;
  cacheKey?: string;
  cacheTtlMs?: number;
  blobStoreName?: string;
}

export async function appConfigHandler(
  req: Request,
  context: Context,
  options: AppConfigOptions,
) {
  const {
    appName,
    cacheKey = `${appName}-config-cache`,
    cacheTtlMs = DEFAULT_CACHE_TTL_MS,
    blobStoreName = 'appconfig',
  } = options;

  const configStore = getStore(blobStoreName);

  // GET - Fetch configuration settings and feature flags with caching
  if (req.method === 'GET') {
    try {
      // Try to get cached config first
      const cachedData = await configStore.getWithMetadata(cacheKey, {
        type: 'json',
      });

      const now = Date.now();

      // Check if we have valid cached data
      if (
        cachedData &&
        cachedData.metadata &&
        typeof cachedData.metadata.timestamp === 'number' &&
        now - cachedData.metadata.timestamp < cacheTtlMs
      ) {
        return new Response(JSON.stringify(cachedData.data), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // If no valid cache, fetch fresh data
      const { featureFlags, configurationSettings } = await getAppConfiguration(
        appName,
      );

      const configData: AppConfiguration = {
        featureFlags,
        configurationSettings,
      };

      // Store in blob with timestamp in metadata
      await configStore.setJSON(cacheKey, configData, {
        metadata: { timestamp: now },
      });

      return new Response(
        JSON.stringify({ featureFlags, configurationSettings }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    } catch (error) {
      console.error(`Failed to retrieve configuration for ${appName}:`, error);
      return new Response(
        JSON.stringify({
          error: `Failed to retrieve configuration for ${appName}`,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }

  return new Response(null, {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
