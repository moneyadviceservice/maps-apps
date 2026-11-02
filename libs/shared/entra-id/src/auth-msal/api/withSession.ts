import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { IronSession } from 'iron-session';

import type { SessionCookieConfig } from '../session/loadSessionContext';
import type { MsalSessionData, NextApiRequestWithSession } from '../types';

export type WithSessionOptions = {
  getSession: (
    req: NextApiRequest,
    res: NextApiResponse,
    config: SessionCookieConfig,
  ) => Promise<IronSession<MsalSessionData>>;
  sessionCookieConfig: SessionCookieConfig;
};

/** Handler type for withSession: receives req with session already attached. */
export type WithSessionHandler = (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) => void | Promise<void>;

export function withSession(
  handler: WithSessionHandler,
  options: WithSessionOptions,
): NextApiHandler {
  const { getSession, sessionCookieConfig } = options;
  return async (req: NextApiRequest, res: NextApiResponse) => {
    (
      req as NextApiRequest & { session: IronSession<MsalSessionData> }
    ).session = await getSession(req, res, sessionCookieConfig);
    return handler(req as NextApiRequestWithSession, res);
  };
}
