import { IncomingHttpHeaders } from 'http';
import { FeatureFlagValue } from '@azure/app-configuration';

import { AppConfiguration } from './azureConfigClient';

export async function getAppConfig(
  baseUrl: string,
  apiPath = '/api/appconfig',
): Promise<AppConfiguration> {
  try {
    const url = `${baseUrl}${apiPath}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch app config from ${url}: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching app config:', error);
    // Return empty defaults if API fails
    return { featureFlags: [], configurationSettings: [] };
  }
}

export function getFeatureFlag(
  config: AppConfiguration,
  id: string,
): FeatureFlagValue | undefined {
  return config.featureFlags.find((flag) => flag.id === id);
}

export function isFeatureEnabled(
  config: AppConfiguration,
  id: string,
): boolean {
  const flag = getFeatureFlag(config, id);
  return flag?.enabled ?? false;
}

export function getConfigValue(
  config: AppConfiguration,
  key: string,
): string | undefined {
  const setting = config.configurationSettings.find(
    (setting) => setting.key === key,
  );
  return setting?.value;
}

export function getNumberConfigValue(
  config: AppConfiguration,
  key: string,
  defaultValue: number,
): number {
  const value = getConfigValue(config, key);
  return value !== undefined ? Number(value) : defaultValue;
}

interface RequestWithHeaders {
  headers: IncomingHttpHeaders;
}

export function constructURL(req: RequestWithHeaders): string {
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  return `${protocol}://${host}`;
}
