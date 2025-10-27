import { AppConfigurationClient } from '@azure/app-configuration';

const client = new AppConfigurationClient(
  `Endpoint=${process.env.AZURE_APP_CONFIG_CONNECTION_ENDPOINT};Id=${process.env.AZURE_APP_CONFIG_CONNECTION_ID};Secret=${process.env.AZURE_APP_CONFIG_CONNECTION_SECRET}`,
);

// Configuration Settings
export async function getConfigurationSetting(key: string) {
  const retrievedSetting = await client.getConfigurationSetting({
    key,
  });
  return retrievedSetting.value;
}
