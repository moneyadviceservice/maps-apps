import { NextApiHandler } from 'next';
import { NextApiRequest, NextApiResponse } from 'next/types';

import { getIronSession } from 'iron-session';
import { IronSessionObject } from 'types/iron-session';

import { accountSessionOptions } from './accountSessionOptions';

export const withAccountSession =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    req.session = await getIronSession<IronSessionObject>(
      req,
      res,
      accountSessionOptions,
    );

    return await handler(req, res);
  };
