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

  const PATHS = {
    t1q1: '/pension-basics/transferring-pension',
    t1q2: 'END_JOURNEY',
    t2q1: '/income-savings/state-pension',
    t2q2: '/income-savings/state-benefits',
    t2q3: 'END_JOURNEY',
    t3q1: 'END_JOURNEY',
    t4q1: 'END_JOURNEY',
    t5q1: '/health-family/power-of-attorney',
    t5q2: 'END_JOURNEY',
  } as Record<number, Record<number, string>>;

  const url = PATHS[question];

  if (!answer) {
    // return user to same page, with error param added.
    params.set('error', 'true');
    response.redirect(302, `${pathname}?${params}`);
  } else {
    // clear error, don't display language, set the current question answer
    // and then redirect user to the next page.
    params.delete('error');
    params.delete('language');
    params.set('version', `${APP_VERSION}`);
    params.set(`${question}`, `${+answer + 1}`);
    if (url === 'END_JOURNEY') {
      params.set(`${TASK_PREFIX}${task}`, `${+status}`);
      response.redirect(302, `${BASE_URL}?${params.toString()}#helping`);
    } else {
      response.redirect(302, `${BASE_URL}${url}?${params.toString()}`);
    }
  }
}
