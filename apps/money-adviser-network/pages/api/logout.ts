import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);

  cookies.set('accessToken', '', {
    expires: new Date(0),
    path: '/',
  });

  res.writeHead(302, { Location: '/' }).end();
}
