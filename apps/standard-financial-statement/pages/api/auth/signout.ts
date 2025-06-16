import { NextApiRequest, NextApiResponse } from 'next';

import { signOut } from 'lib/auth/controller';
import { withSession } from 'lib/auth/withSession';

export default withSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    return await signOut(req, res);
  } else {
    res.status(405).end();
  }
});
