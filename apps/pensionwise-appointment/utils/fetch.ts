import { ParsedUrlQuery } from 'querystring';

import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';

export const fetchApptPage = async (query: ParsedUrlQuery) => {
  const lang = query.language ?? 'en';

  try {
    const {
      data: {
        pwdAppointmentPageList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(`maps/pwd-appt-page-${lang}`);

    return items[0];
  } catch (error) {
    console.error('failed to load page:');
  }
};

export const fetchPensionOption = async (id: number, query: ParsedUrlQuery) => {
  const lang = query.language ?? 'en';

  try {
    const {
      data: {
        pwdPensionOptionList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `maps/pwd-appt-pension-option-${lang}`,
      {
        id,
      },
    );

    return items[0];
  } catch (error) {
    console.error('failed to load pension option: ', id);
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
      `maps/pwd-appt-detail-${lang}`,
      { id },
    );

    return items[0];
  } catch (error) {
    console.error('failed to load detail: ', id);
  }
};

export const fetchQuestion = async (id: number, query: ParsedUrlQuery) => {
  const lang = query.language ?? 'en';

  try {
    const {
      data: {
        pwdQuestionList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `maps/pwd-appt-question-${lang}`,
      {
        id,
      },
    );

    return items[0];
  } catch (error) {
    console.error('failed to load question: ', id);
  }
};

export const fetchSave = async (query: ParsedUrlQuery, page: string) => {
  const lang = query.language ?? 'en';

  try {
    const {
      data: {
        pwdSaveList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(`maps/pwd-appt-save-${lang}`);

    return items.find((t: any) => t.slug === page);
  } catch (error) {
    console.error('failed to load page: ');
  }
};

export const fetchProgress = async (query: ParsedUrlQuery, slug: string) => {
  const lang = query.language ?? 'en';

  try {
    const {
      data: {
        pwdProgressSavedList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `maps/pwd-appt-progress-${lang}`,
      {
        slug,
      },
    );

    return items[0];
  } catch (error) {
    console.error('failed to load page: ');
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

export const fetchSummary = async (query: ParsedUrlQuery) => {
  const lang = query.language ?? 'en';

  try {
    const {
      data: {
        pwdSummaryPageList: { items },
      },
    } = await aemHeadlessClient.runPersistedQuery(
      `maps/pwd-appt-summary-${lang}`,
    );
    return items[0];
  } catch (error) {
    console.error('failed to load summary content');
  }
};
