import {
  AppConfigurationClient,
  ConfigurationSetting,
  FeatureFlagValue,
  isFeatureFlag,
  parseFeatureFlag,
} from '@azure/app-configuration';

export interface AppConfiguration {
  featureFlags: FeatureFlagValue[];
  configurationSettings: ConfigurationSetting[];
}

export async function getAppConfiguration(
  label: string,
): Promise<AppConfiguration> {
  const client = new AppConfigurationClient(
    process.env.AZURE_APP_CONFIG_CONNECTION_STRING ?? '',
  );

  const retrievedSettingsIterator = client.listConfigurationSettings({
    labelFilter: label,
  });

  const featureFlags: FeatureFlagValue[] = [];
  const configurationSettings: ConfigurationSetting[] = [];

  for await (const setting of retrievedSettingsIterator) {
    if (isFeatureFlag(setting)) {
      featureFlags.push(parseFeatureFlag(setting).value);
    } else {
      configurationSettings.push(setting);
    }
  }

  return { featureFlags, configurationSettings };
}
