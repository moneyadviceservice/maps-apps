import type { NextApiRequest, NextApiResponse } from 'next';

import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { accountAuthRoutes } from 'lib/accountAuth/routes';
import { IronSessionObject } from 'types/iron-session';

export default withAccountSession(async function handler(
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    return res.end();
  }

  req.session.destroy();

  return res.redirect(302, accountAuthRoutes.pages.login);
});
