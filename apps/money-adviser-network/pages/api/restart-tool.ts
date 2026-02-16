import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { PAGES, PATHS } from '../../CONSTANTS';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lang } = req.query;

  const cookies = new Cookies(req, res);

  cookies.set('data', '', {
    path: '/',
  });

  res
    .writeHead(302, { Location: `/${lang}/${PATHS.START}/${PAGES.START}` })
    .end();
}
