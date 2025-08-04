import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export const fetchHomepage = async (lang: string) => {
  try {
    const {
      data: {
        homepageTemplateList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(`sfs/get-homepage-${lang}`);

    if (items.length === 0) {
      return {
        error: true,
      };
    }

    return items[0];
  } catch (error) {
    console.error('Failed to fetch homepage:', error);
    return { error: true };
  }
};
