import type { Redirect } from 'next';

import { type JourneyPage } from 'data/journey';
import type { ParsedUrlQuery } from 'node:querystring';
import { getSessionId } from 'utils/getSessionId';
import { journeyPath } from 'utils/journeyPath';

import { getLanguage } from '@maps-react/utils/language';

type JourneyContext = {
  language: string;
  sessionId: string;
};

type JourneyRedirect = {
  redirect: Redirect;
};

export const getJourneyContext = (
  query: ParsedUrlQuery,
  params: ParsedUrlQuery | undefined,
  page: JourneyPage,
): JourneyContext | JourneyRedirect => {
  const language = getLanguage(params?.language);
  const sessionId = getSessionId(query.sessionId);

  if (!query.sessionId) {
    return {
      redirect: {
        destination: journeyPath(language, page, sessionId),
        permanent: false,
      },
    };
  }

  return { language, sessionId };
};
