import { FeatureFlagValue } from '@azure/app-configuration';

import { AppConfiguration } from './azureConfigClient';

export async function getAppConfig(
  apiPath = '/api/appconfig',
): Promise<AppConfiguration> {
  try {
    const baseUrl =
      process.env.URL ?? // Netlify production URL
      process.env.DEPLOY_PRIME_URL ?? // Netlify preview/branch URL
      process.env.DEPLOY_URL; // Netlify specific deployment URL
    const url = new URL(apiPath, baseUrl).toString();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch app config: ${response.status}`);
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
