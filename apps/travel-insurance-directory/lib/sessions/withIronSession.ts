import { NextApiHandler } from 'next';
import { NextApiRequest, NextApiResponse } from 'next/types';

import { getIronSession, SessionOptions } from 'iron-session';
import { IronSessionObject } from 'types/iron-session';

export const withIronSession =
  (handler: NextApiHandler, sessionOptions: SessionOptions) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    req.session = await getIronSession<IronSessionObject>(
      req,
      res,
      sessionOptions,
    );

    return await handler(req, res);
  };
