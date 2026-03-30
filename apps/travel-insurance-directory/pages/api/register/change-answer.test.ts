import { NextApiRequest, NextApiResponse } from 'next';

import { IronSessionObject } from 'types/iron-session';
import { respond } from 'utils/api/respond';

import handler from './change-answer';

jest.mock('utils/api/respond');
jest.mock('lib/sessions/withIronSession', () => ({
  withIronSession: (
    fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  ) => fn,
}));

describe('Change Link API Handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: { pageStep: 'step3', pagePath: '/register/scenario' },
      session: { db_id: 'test-session-id' } as IronSessionObject,
    };
    res = {};
  });

  it('should construct the redirect URL correctly and call respond', async () => {
    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(respond).toHaveBeenCalledWith(req, res, {
      data: {
        success: true,
        nextPath: '/register/scenario/step3?change=true',
      },
      redirect: '/register/scenario/step3?change=true',
    });
  });

  it('should handle missing body data by falling back to the error state', async () => {
    req = { body: undefined };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
        redirect: '/register/confirm-details',
      }),
    );
  });
});
