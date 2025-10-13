import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { PROTOCOL } from '../../lib/constants';
import { postPensionsDataRetrieval } from '../../lib/fetch/post-pensions-data-retrieval';
import { getMhpdSessionConfig } from '../../lib/utils/sessionConfig';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    headers: { host },
    query: { ticket },
  } = request;

  const redirectPath = `${PROTOCOL}${host}/en/welcome`;
  const cookies = new Cookies(request, response);
  const { userSessionId } = getMhpdSessionConfig(cookies);

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
