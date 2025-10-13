import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export const getSupportChannel = async (id: string) => {
  try {
    const {
      data: {
        supportChannelList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(`mhpd/getSupportChannel`, {
      id,
    });

    return items[0];
  } catch (error) {
    console.error('failed to get support channel faqs:', error);
  }
};
