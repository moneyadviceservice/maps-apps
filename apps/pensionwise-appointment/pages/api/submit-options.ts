import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    body: { task, status, question, answer, language },
    headers: { referer },
  } = request;

  const { search, pathname } = new URL(referer ?? '');
  const params = new URLSearchParams(search);
  const BASE_URL = `/${language}/${process.env.appUrl}`;
  const APP_VERSION = process.env.appVersion;
  const TASK_PREFIX = 't';

  if (!answer) {
    // return user to same page, with error param added.
    params.set('error', 'true');
    response.redirect(302, `${pathname}?${params}`);
  } else {
    // clear error, don't display language or current task, set the current question answer
    // and then redirect user to the next page.
    params.delete('error');
    params.delete('language');
    params.delete('task');
    params.set('version', `${APP_VERSION}`);
    params.set(`${question}`, `${+answer + 1}`);
    params.set(`${TASK_PREFIX}${task}`, `${+status}`);
    response.redirect(302, `${BASE_URL}?${params.toString()}#options`);
  }
}
