import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { withSession } from 'lib/auth/sessionManagement';
import type { IronSessionObject } from 'types/iron-session';

import type {
  NextApiRequestWithSession,
  WithSessionHandler,
} from '@maps-react/entra-id/auth-msal';

export function ensurePostMethodAndAdminSession(
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
): boolean {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return false;
  }

  // Admin GSSP pages skip Entra under CI; allow the same for mutation APIs
  // so Playwright can exercise Add/Hide against Cosmos firms.
  if (process.env.CI !== 'true' && !req.session?.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
}

/**
 * Like {@link withSession}, but under CI attaches an empty session instead of
 * iron-session — pipeline e2e often has no SESSION_SECRET, and admin GSSP
 * already skips Entra the same way.
 */
export function withAdminFirmApiSession(
  handler: WithSessionHandler,
): NextApiHandler {
  const withRealSession = withSession(handler);
  return async (req, res) => {
    if (process.env.CI === 'true') {
      (req as NextApiRequestWithSession).session =
        {} as NextApiRequestWithSession['session'];
      await handler(req as NextApiRequestWithSession, res);
      return;
    }
    await withRealSession(req, res);
  };
}

export function getFirmIdFromAdminRequest(req: NextApiRequest): string {
  const raw = req.query?.id;
  if (typeof raw === 'string') {
    return raw.trim();
  }
  if (Array.isArray(raw) && raw[0]) {
    return String(raw[0]).trim();
  }
  return '';
}

export function redirectToAdminFirmDetail(
  res: NextApiResponse,
  firmId: string,
): void {
  res.redirect(302, `/admin/firms/${firmId}`);
}
