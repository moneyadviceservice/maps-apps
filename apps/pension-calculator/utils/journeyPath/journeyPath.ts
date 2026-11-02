import type { JourneyPage } from 'data/journey';

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
