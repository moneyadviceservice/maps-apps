import { NextApiRequest, NextApiResponse } from 'next';

import { signIn } from 'lib/auth/controller';
import { withSession } from 'lib/auth/withSession';

export default withSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const redirectTo = (req.query.redirectTo as string) ?? req.headers.referer;

  if (req.method === 'GET') {
    return await signIn(req, res, { redirectTo: redirectTo });
  } else {
    res.status(405).end();
  }
});
