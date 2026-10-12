import { DocumentTemplate } from 'types/@adobe/page';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

type PageError = {
  error: boolean;
};

export const fetchPage = async (
  lang: string,
  slug: string,
): Promise<DocumentTemplate | PageError> => {
  try {
    const queryName = `evidence-hub/get-page-${lang};slug=${slug}`;

    const {
      data: {
        pageTemplateList: { items: pageTemplate },
      },
    } = await aemHeadlessClient.runPersistedQuery(queryName);

    if (pageTemplate.length === 0) {
      return {
        error: true,
      } as PageError;
    }

    const result = pageTemplate[0];

    return result;
  } catch (error) {
    console.error('failed to fetch page ', error);
    return {
      error: true,
    } as PageError;
  }
};
