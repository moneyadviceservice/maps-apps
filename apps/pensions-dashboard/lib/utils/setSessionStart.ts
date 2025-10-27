import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';

import Cookies from 'cookies';

import {
  getMhpdSessionConfig,
  updateSessionConfigField,
} from './sessionConfig';

/**
 * Set the session start timestamp in the consolidated session config cookie
 * Only sets if it doesn't already exist or is empty
 */
export const setSessionStart = (
  context:
    | GetServerSidePropsContext
    | { req: NextApiRequest; res: NextApiResponse },
) => {
  const cookies = new Cookies(context.req, context.res);
  const { sessionStart } = getMhpdSessionConfig(cookies);

  if (!sessionStart || sessionStart === '') {
    updateSessionConfigField(cookies, 'sessionStart', Date.now().toString());
  }
};
