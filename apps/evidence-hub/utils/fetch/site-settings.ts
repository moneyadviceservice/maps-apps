import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export const fetchSiteSettings = async (lang: string) => {
  try {
    const {
      data: {
        siteSettingsByPath: { item },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `evidence-hub/site-settings-${lang}`,
    );

    return item;
  } catch (error) {
    console.error('failed to site settings:', error);
  }
};
