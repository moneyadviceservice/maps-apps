import { HomepageTemplate } from 'types/@adobe/homepage';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

type PageError = {
  error: boolean;
};

export const fetchHomepage = async (
  lang: string,
): Promise<HomepageTemplate | PageError> => {
  try {
    const queryName = `evidence-hub/homepage-${lang}`;

    const {
      data: {
        homepageList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(queryName);

    if (items.length === 0) {
      return {
        error: true,
      } as PageError;
    }

    const result = items[0];

    return result;
  } catch (error) {
    console.error('failed to fetch homepage', error);
    return {
      error: true,
    } as PageError;
  }
};
