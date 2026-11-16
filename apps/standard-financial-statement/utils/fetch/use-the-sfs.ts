import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export const fetchUseTheSfs = async (lang: string, slug: string[]) => {
  try {
    const {
      data: {
        useTheSfsTemplateList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `sfs/use-the-sfs-${lang};slug=${slug}`,
    );

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
