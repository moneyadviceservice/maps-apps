import { NextApiRequest, NextApiResponse } from 'next';

import { login } from 'lib/auth/provider';
import { withSession } from 'lib/auth/utils/withSession';

export default withSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const redirectTo = (req.query.redirectTo as string) ?? req.headers.referer;

  if (req.method === 'GET') {
    return await login(req, res, { redirectTo: redirectTo });
  } else {
    res.status(405).end();
  }
});
