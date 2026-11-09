import { JOURNEY_PAGES, type JourneyPage } from 'data/journey';

const withSessionQuery = (
  path: string,
  sessionId?: string,
  extra?: Record<string, string>,
) => {
  const params = new URLSearchParams(extra);
  if (sessionId) {
    params.set('sessionId', sessionId);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export const journeyPath = (
  language: string,
  page: JourneyPage,
  sessionId?: string,
  extra?: Record<string, string>,
) => withSessionQuery(`/${language}/${page}`, sessionId, extra);

/** Append or replace sessionId on a path that may already include a query string. */
export const withSessionId = (path: string, sessionId: string) => {
  const questionIndex = path.indexOf('?');
  const pathname = questionIndex === -1 ? path : path.slice(0, questionIndex);
  const existing = questionIndex === -1 ? '' : path.slice(questionIndex + 1);

  return withSessionQuery(
    pathname,
    sessionId,
    Object.fromEntries(new URLSearchParams(existing)),
  );
};

export const landingPath = (language: string) => `/${language}`;

/** Save page for a journey step, remembering that step for Back and the email. */
export const saveJourneyPath = (
  language: string,
  page: JourneyPage,
  sessionId?: string,
) =>
  journeyPath(language, JOURNEY_PAGES.SAVE, sessionId, {
    returnTo: journeyPath(language, page, sessionId),
  });

/** Keep returnTo on this site. Anything else goes back to About you. */
export const safeReturnTo = (
  returnTo: string | undefined,
  language: string,
  sessionId: string,
) => {
  if (returnTo?.startsWith(`/${language}/`)) {
    return withSessionId(returnTo, sessionId);
  }

  return journeyPath(language, JOURNEY_PAGES.ABOUT_YOU, sessionId);
};
