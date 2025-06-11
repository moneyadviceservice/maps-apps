import { NextApiRequest, NextApiResponse } from 'next/types';

import { handleRedirect } from 'lib/auth/controller';
import { withSession } from 'lib/auth/withSession';

export default withSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return await handleRedirect(req, res);
  } else {
    res.status(405).end();
  }
});
