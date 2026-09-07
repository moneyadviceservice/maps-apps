import { DocumentTemplate } from 'types/@adobe/page';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

type PageError = {
  error: boolean;
};

export const fetchDocument = async (
  lang: string,
  query: {
    pageType: string;
    slug: string;
  },
): Promise<DocumentTemplate | PageError> => {
  try {
    const {
      data: {
        pageSectionTemplateList: { items: documentTemplate },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `evidence-hub/get-document-${lang}`,
      query,
    );

    if (documentTemplate.length === 0) {
      return {
        error: true,
      } as PageError;
    }

    return documentTemplate[0];
  } catch (error) {
    console.error('failed to fetch page ', error);
    return {
      error: true,
    } as PageError;
  }
};
