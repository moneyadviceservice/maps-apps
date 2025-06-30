import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { COOKIE_OPTIONS } from '../../lib/constants';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.query.token as string | undefined;

  const cookies = new Cookies(req, res);
  cookies.set('beaconId', token, {
    ...COOKIE_OPTIONS,
  });

  // Redirect to start the service page
  res.redirect(302, '/');
}
