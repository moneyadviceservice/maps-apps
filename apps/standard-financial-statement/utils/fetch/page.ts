import {
  PageError,
  PageSectionTemplate,
  PageTemplate,
} from 'types/@adobe/page';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export const fetchPage = async (
  lang: string,
  slug: string[],
): Promise<
  | {
      pageTemplate: PageTemplate | null;
      pageSectionTemplate: PageSectionTemplate | null;
    }
  | PageError
> => {
  try {
    const {
      data: {
        pageTemplateList: { items: pageTemplate },
        pageSectionTemplateList: { items: pageSectionTemplate },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `sfs/get-page-${lang};slug=${slug.join('>')}`,
    );

    if (pageTemplate.length === 0 && pageSectionTemplate.length === 0) {
      return {
        error: true,
      } as PageError;
    }

    return {
      pageTemplate: pageTemplate.length > 0 ? pageTemplate[0] : null,
      pageSectionTemplate:
        pageSectionTemplate.length > 0 ? pageSectionTemplate[0] : null,
    };
  } catch (error) {
    console.error('failed to fetch page ', error);
    return {
      error: true,
    } as PageError;
  }
};
