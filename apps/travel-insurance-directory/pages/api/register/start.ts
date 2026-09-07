import type { NextApiRequest, NextApiResponse } from 'next';

import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { clearRegistrationSession } from 'lib/register/clearRegistrationSession';
import type { IronSessionObject } from 'types/iron-session';

const NEXT_STEP_URL = '/register/fca';

export default withAccountSession(async function handler(
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  if (clearRegistrationSession(req.session)) {
    await req.session.save();
  }

  return res.redirect(302, NEXT_STEP_URL);
});
