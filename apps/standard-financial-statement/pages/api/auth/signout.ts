import { NextApiRequest, NextApiResponse } from 'next';

import { logout } from 'lib/auth/provider';
import { withSession } from 'lib/auth/utils/withSession';

export default withSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    return await logout(req, res);
  } else {
    res.status(405).end();
  }
});
