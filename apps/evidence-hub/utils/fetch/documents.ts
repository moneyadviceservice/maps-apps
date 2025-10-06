import { DocumentTemplate } from 'types/@adobe/page';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

import { buildFilterObject } from '../filter';

type PageError = {
  error: boolean;
};

export const fetchDocuments = async (
  query: Record<string, string | string[] | undefined> = {},
): Promise<
  | {
      documents: DocumentTemplate[];
    }
  | PageError
> => {
  try {
    const filterObject = buildFilterObject(query);

    const filterParam = encodeURIComponent(JSON.stringify(filterObject));
    const queryName = `evidence-hub/filter;filter=${filterParam}`;

    const {
      data: {
        pageSectionTemplateList: { items: documents },
      },
    } = await aemHeadlessClient.runPersistedQuery(queryName);

    return documents;
  } catch (error) {
    console.error('failed to fetch fetchDocuments ', error);
    return {
      error: true,
    } as PageError;
  }
};
