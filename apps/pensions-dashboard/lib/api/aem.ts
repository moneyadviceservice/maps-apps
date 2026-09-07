import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

// Functions
/**
 * Retrieves support channel information from AEM (Adobe Experience Manager).
 *
 * @param {string} id - The support channel identifier
 *
 * @returns {Promise<any>} Promise that resolves to the support channel data or undefined on error
 *
 * @throws {Error} Logs error to console but does not throw (returns undefined instead)
 */
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
