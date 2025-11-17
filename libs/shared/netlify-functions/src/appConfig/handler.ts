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
  useEnvironmentLabel?: boolean;
}

function getEnvironmentLabel(appName: string): string {
  // Determine environment from Netlify context
  const isProd = process.env.CONTEXT === 'production';

  // Return appropriate Azure App Configuration label
  return isProd ? `${appName}-production` : `${appName}-staging`;
}

export async function appConfigHandler(
  req: Request,
  context: Context,
  options: AppConfigOptions,
) {
  const {
    appName,
    cacheKey,
    cacheTtlMs = DEFAULT_CACHE_TTL_MS,
    blobStoreName = 'appconfig',
    useEnvironmentLabel = true,
  } = options;

  // Determine the label to use for Azure App Configuration
  const configLabel = useEnvironmentLabel
    ? getEnvironmentLabel(appName)
    : appName;

  // Use environment-specific cache key
  const effectiveCacheKey = cacheKey ?? `${configLabel}-config-cache`;

  const configStore = getStore(blobStoreName);

  // GET - Fetch configuration settings and feature flags with caching
  if (req.method === 'GET') {
    try {
      // Try to get cached config first
      const cachedData = await configStore.getWithMetadata(effectiveCacheKey, {
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
        configLabel,
      );

      const configData: AppConfiguration = {
        featureFlags,
        configurationSettings,
      };

      // Store in blob with timestamp in metadata
      await configStore.setJSON(effectiveCacheKey, configData, {
        metadata: { timestamp: now },
      });

      return new Response(
        JSON.stringify({ featureFlags, configurationSettings }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    } catch (error) {
      console.error(
        `Failed to retrieve configuration for ${configLabel}:`,
        error,
      );
      return new Response(
        JSON.stringify({
          error: `Failed to retrieve configuration for ${configLabel}`,
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
