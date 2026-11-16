import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    body: { question, answer, language },
    headers: { referer },
  } = request;

  const { search, pathname } = new URL(referer ?? '');
  const params = new URLSearchParams(search);
  const BASE_URL = `/${language}/${process.env.appUrl}`;
  const PWD_APPOINTMENT_URL = `${process.env.PWD_APPOINTMENT_HOSTNAME}/${language}/${process.env.PWD_APPOINTMENT_APPNAME}`;

  const PATHS = {
    q1: ['/age/under-50', '/age/50-54', '/pension-type', '/age/75-and-over'],
    q2: ['/terminal-illness', '/pension-type/no-dc-pension'],
    q3: ['/terminal-illness/coping-with-terminal-illness', '/lifetime-annuity'],
    q4: ['/lifetime-annuity/lifetime-annuity-in-payment', '/debts'],
    q5: ['/debt-advice', 'END_JOURNEY'],
    q6: ['END_JOURNEY', '/debt-advice/have-not-received-debt-advice'],
  } as Record<number, Record<number, string>>;

  const url = PATHS[question][answer];

  if (!answer) {
    // return user to same page, with error param added.
    params.set('error', 'true');
    response.redirect(302, `${pathname}?${params}`);
  } else if (url === 'END_JOURNEY') {
    // pass the age param to appointment for print/download of document
    response.redirect(302, `${PWD_APPOINTMENT_URL}?age=${params.get('q1')}`);
  } else {
    // clear error, don't display language, set the current question answer
    // and then redirect user to the next page.
    params.delete('error');
    params.delete('language');
    params.set(`${question}`, `${+answer + 1}`);
    response.redirect(302, `${BASE_URL}${url}?${params.toString()}`);
  }
}
