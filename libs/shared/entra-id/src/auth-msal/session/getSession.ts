import { NextApiRequest, NextApiResponse } from 'next';

import { getIronSession } from 'iron-session';

import type { SessionCookieConfig } from './loadSessionContext';
import type { MsalSessionData } from '../types';

/**
 * Wraps getIronSession with typed req/res so callers don't repeat the cast.
 * Use in createAppSessionManagement, createAppProvider, and createWithSession.
 */
export async function getSession(
  req: NextApiRequest,
  res: NextApiResponse,
  config: SessionCookieConfig,
) {
  return getIronSession<MsalSessionData>(
    req as Parameters<typeof getIronSession>[0],
    res as Parameters<typeof getIronSession>[1],
    config,
  );
}
