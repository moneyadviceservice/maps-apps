import { NextApiResponse } from 'next';

import { logout } from 'lib/auth/provider';
import { withSession } from 'lib/auth/sessionManagement';

import { NextApiRequestWithSession } from '@maps-react/entra-id/auth-msal';

export default withSession(async function handler(
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    return await logout(req, res);
  } else {
    res.status(405).end();
  }
});
