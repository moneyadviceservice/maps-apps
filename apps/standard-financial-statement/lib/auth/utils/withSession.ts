import { NextApiHandler } from 'next';
import { NextApiRequest, NextApiResponse } from 'next/types';

import { getIronSession } from 'iron-session';
import { IronSessionObject } from 'types/iron-session';

import { sessionCookieConfig } from '../sessionCookieConfig';

export const withSession =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    req.session = await getIronSession<IronSessionObject>(
      req,
      res,
      sessionCookieConfig,
    );

    return handler(req, res);
  };
