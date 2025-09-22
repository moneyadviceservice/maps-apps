import { NextApiRequest, NextApiResponse } from 'next/types';

import { handleRedirect } from 'lib/auth/provider';
import { withSession } from 'lib/auth/utils/withSession';

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
