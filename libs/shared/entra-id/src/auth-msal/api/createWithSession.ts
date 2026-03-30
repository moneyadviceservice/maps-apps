import { NextApiHandler } from 'next';

import { withSession } from './withSession';
import type { WithSessionHandler } from './withSession';
import { getSession } from '../session/getSession';
import type { SessionCookieConfig } from '../session/loadSessionContext';

/**
 * Returns a withSession function bound to the given sessionCookieConfig.
 * Use in apps so they only need: export const withSession = createWithSession(sessionCookieConfig);
 */
export function createWithSession(
  sessionCookieConfig: SessionCookieConfig,
): (handler: WithSessionHandler) => NextApiHandler {
  return (handler: WithSessionHandler) =>
    withSession(handler, {
      getSession: (req, res, config) => getSession(req, res, config),
      sessionCookieConfig,
    });
}
