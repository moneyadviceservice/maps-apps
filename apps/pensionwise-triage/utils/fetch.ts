import { aemHeadlessClient } from '@maps-digital/shared/utils';
import { ParsedUrlQuery } from 'querystring';

export const fetchQuestion = async (id: number, query: ParsedUrlQuery) => {
  const lang = query.language ?? 'en';

  try {
    const {
      data: {
        pwdQuestionList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(`maps/pwd-triage-${lang}`, {
      id,
    });

    return items[0];
  } catch (error) {
    console.error('failed to load question: ', id);
  }
};

export const fetchDetail = async (id: number, query: ParsedUrlQuery) => {
  const lang = query.language ?? 'en';

  try {
    const {
      data: {
        pwdDetailList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `maps/pwd-triage-detail-${lang}`,
      { id },
    );

    return items[0];
  } catch (error) {
    console.error('failed to load detail: ', id);
  }
};

export const fetchShared = async (query: ParsedUrlQuery) => {
  const lang = query.language ?? 'en';

  try {
    const {
      data: {
        pwdSharedContentList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(`maps/pwd-shared-${lang}`);

    return items[0];
  } catch (error) {
    console.error('failed to load shared content');
  }
};
