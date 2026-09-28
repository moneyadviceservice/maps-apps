import { NextApiResponse } from 'next';

import { handleRedirect } from 'lib/auth/provider';
import { withSession } from 'lib/auth/sessionManagement';

import { NextApiRequestWithSession } from '@maps-react/entra-id/auth-msal';

export default withSession(async function handler(
  req: NextApiRequestWithSession,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return await handleRedirect(req, res);
  }
  res.status(405).end();
});
