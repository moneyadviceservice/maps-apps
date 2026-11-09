import { NextApiResponse } from 'next';

import { login } from 'lib/auth/provider';
import { withSession } from 'lib/auth/sessionManagement';

import { NextApiRequestWithSession } from '@maps-react/entra-id/auth-msal';

export default withSession(async function handler(
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) {
  const redirectTo = (req.query.redirectTo as string) ?? req.headers.referer;

  if (req.method === 'GET') {
    return await login(req, res, {
      redirectTo: redirectTo ?? undefined,
    });
  }
  res.status(405).end();
});
