import { TagListItem } from 'types/@adobe/page';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

type PageError = {
  error: boolean;
};

export const getTags = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: string,
): Promise<TagListItem[] | PageError> => {
  try {
    const {
      data: {
        tagListList: { items: tagList },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `evidence-hub/get-tag-filters-en`,
    );

    if (tagList.length === 0) {
      return {
        error: true,
      } as PageError;
    }

    return tagList[0].tagGroup;
  } catch (error) {
    console.error('failed to fetch tags ', error);
    return {
      error: true,
    } as PageError;
  }
};
