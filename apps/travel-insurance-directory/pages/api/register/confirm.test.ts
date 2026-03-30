import { NextApiRequest, NextApiResponse } from 'next';

import { fetchFirm } from 'lib/firms/fetchFirm';
import { IronSessionObject } from 'types/iron-session';
import { respond } from 'utils/api/respond';

import handler from './confirm';

const mockPatch = jest.fn();

const mockContainer = {
  item: jest.fn().mockReturnValue({
    patch: mockPatch,
  }),
};

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: mockContainer,
    }),
}));

jest.mock('lib/firms/fetchFirm');
jest.mock('utils/api/respond');
jest.mock('lib/sessions/withIronSession', () => ({
  withIronSession: (
    fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  ) => fn,
}));
jest.mock('lib/notify/tid-register-unsuccessful');
jest.mock('lib/notify/tid-register-success');

describe('Medical Conditions API Handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: { field: 'medical_conditions' },
      session: { db_id: 'test-session-id' } as IronSessionObject,
    };
    res = {};
  });

  it('should redirect to success if 15 or more conditions are "true"', async () => {
    const mockConditions = {
      cond1: 'true',
      cond2: 'true',
      cond3: 'true',
      cond4: 'true',
      cond5: 'true',
      cond6: 'true',
      cond7: 'true',
      cond8: 'true',
      cond9: 'true',
      cond10: 'true',
      cond11: 'true',
      cond12: 'true',
      cond13: 'true',
      cond14: 'true',
      cond15: 'true',
    };

    (fetchFirm as jest.Mock).mockResolvedValue({
      response: { medical_coverage: { specific_conditions: mockConditions } },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(respond).toHaveBeenCalledWith(req, res, {
      data: { success: true, nextPath: '/register/success' },
      redirect: '/register/success',
    });
  });

  it('should redirect to unsuccessful if fewer than 15 conditions are "true"', async () => {
    const mockConditions = {
      cond1: 'true',
      cond2: 'false',
    };

    (fetchFirm as jest.Mock).mockResolvedValue({
      response: { medical_coverage: { specific_conditions: mockConditions } },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(respond).toHaveBeenCalledWith(req, res, {
      data: { success: true, nextPath: '/register/unsuccessful' },
      redirect: '/register/unsuccessful',
    });
  });

  it('should handle errors and return a 500 status', async () => {
    (fetchFirm as jest.Mock).mockRejectedValue(new Error('Database down'));

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

  it('should handle missing session ID gracefully (defaulting to unsuccessful)', async () => {
    req.session = {};

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        redirect: '/register/unsuccessful',
      }),
    );
  });
});
