import type { NextApiRequest, NextApiResponse } from 'next';

import { postPensionsDataRetrieval } from '../../lib/api/pension-data-service';
import { PROTOCOL } from '../../lib/constants';
import { Cookies, getMhpdSessionConfig } from '../../lib/utils/system';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    headers: { host },
    query: { ticket },
  } = request;

  const cookies = new Cookies(request, response);
  const { userSessionId, locale } = getMhpdSessionConfig(cookies);
  const currentLocale = locale === 'cy' ? 'cy' : 'en';
  const redirectPath = `${PROTOCOL}${host}/${currentLocale}/welcome`;

  // POST to /pensions-data-retrieval with the single use ticket
  //  - userSessionId
  //  - ticket
  try {
    await postPensionsDataRetrieval({
      userSessionId,
      ticket: ticket as string,
    });
  } catch (error) {
    console.error('Error POST /pensions-data-retrieval:', error);
    response.status(500).end();
    return;
  }

  // Redirect to the welcome page
  response.redirect(302, redirectPath);
}
