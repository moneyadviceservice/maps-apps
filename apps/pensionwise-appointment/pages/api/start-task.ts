import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    body: { task, status, language },
    headers: { referer },
  } = request;

  const { search } = new URL(referer ?? '');
  const params = new URLSearchParams(search);
  const BASE_URL = `/${language}/${process.env.appUrl}`;
  const APP_VERSION = process.env.appVersion;
  const TASK_PREFIX = 't';

  const PATHS = {
    t1: '/pension-basics',
    t2: '/income-savings',
    t3: '/debt-repayment',
    t4: '/your-home',
    t5: '/health-family',
    t6: '/retire-later-or-delay',
    t7: '/guaranteed-income',
    t8: '/flexible-income',
    t9: '/lump-sums',
    t10: '/take-pot-in-one',
    t11: '/mix-options',
    t12: '/summary',
  } as Record<string, Record<number, string>>;

  const url = PATHS[`${TASK_PREFIX}${task}`];

  params.delete('language');
  params.delete('returning');
  params.set('version', `${APP_VERSION}`);
  params.set(`${TASK_PREFIX}${task}`, `${+status}`);
  params.set(`task`, `${+task}`);
  if (`${TASK_PREFIX}${task}` === 't12') {
    params.set('complete', 'true');
    params.set(`${TASK_PREFIX}${task}`, `4`);
  }
  response.redirect(302, `${BASE_URL}${url}?${params.toString()}`);
}
