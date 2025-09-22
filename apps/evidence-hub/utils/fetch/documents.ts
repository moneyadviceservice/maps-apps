import { DocumentTemplate } from 'types/@adobe/page';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

type PageError = {
  error: boolean;
};

export const fetchDocuments = async (
  lang: string,
): Promise<
  | {
      documents: DocumentTemplate | null;
    }
  | PageError
> => {
  try {
    const {
      data: {
        pageSectionTemplateList: { items: documents },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `evidence-hub/get-documents-${lang}`,
    );

    return documents;
  } catch (error) {
    console.error('failed to fetch fetchDocuments ', error);
    return {
      error: true,
    } as PageError;
  }
};
