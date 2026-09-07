import { NextApiRequest, NextApiResponse } from 'next';

import { REQUIRED_HIGH_RISK_TRUE_COUNT } from 'lib/account/registrationCompletion';
import {
  emptySpecificConditions,
  SPECIFIC_CONDITION_KEYS,
} from 'lib/firms/firmDefaults';
import { resolveRegisterFirm } from 'lib/register/resolveRegisterFirm';
import { IronSessionObject } from 'types/iron-session';
import { respond } from 'utils/api/respond';

import handler from 'pages/api/register/confirm';

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

jest.mock('lib/register/resolveRegisterFirm');
jest.mock('utils/api/respond');
jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: (
    fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  ) => fn,
}));
jest.mock('lib/notify/tid-register-unsuccessful');
jest.mock('lib/notify/tid-register-success');

const mockedCompleteConfirmRegistration = jest.fn();
jest.mock('lib/register/completeConfirmRegistration', () => ({
  completeConfirmRegistration: (...args: unknown[]) =>
    mockedCompleteConfirmRegistration(...args),
}));

const mockedUpdateFirm = jest.fn();
jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: (...args: unknown[]) => mockedUpdateFirm(...args),
}));

function specificConditionsWithTrueCount(trueCount: number) {
  const specific_conditions = emptySpecificConditions();
  SPECIFIC_CONDITION_KEYS.forEach((key, index) => {
    specific_conditions[key] = index < trueCount ? 'true' : 'false';
  });
  return specific_conditions;
}

describe('Medical Conditions API Handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedCompleteConfirmRegistration.mockResolvedValue({ success: true });
    req = {
      body: { field: 'medical_conditions' },
      session: { db_id: 'test-session-id' } as IronSessionObject,
    };
    res = {};
  });

  it('should redirect to success if 15 or more conditions are "true"', async () => {
    (resolveRegisterFirm as jest.Mock).mockResolvedValue({
      id: 'firm-1',
      type: 'main',
      approved_at: null,
      reregistered_at: null,
      reregister_approved_at: null,
      medical_coverage: {
        specific_conditions: specificConditionsWithTrueCount(
          REQUIRED_HIGH_RISK_TRUE_COUNT,
        ),
      },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockedCompleteConfirmRegistration).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'firm-1' }),
    );
    expect(respond).toHaveBeenCalledWith(req, res, {
      data: { success: true, nextPath: '/register/success' },
      redirect: '/register/success',
    });
  });

  it('sets reregister_approved_at when pending re-registration succeeds', async () => {
    (resolveRegisterFirm as jest.Mock).mockResolvedValue({
      id: 'firm-pending',
      type: 'main',
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
      medical_coverage: {
        specific_conditions: specificConditionsWithTrueCount(
          REQUIRED_HIGH_RISK_TRUE_COUNT,
        ),
      },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockedCompleteConfirmRegistration).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'firm-pending' }),
    );
    expect(respond).toHaveBeenCalledWith(req, res, {
      data: { success: true, nextPath: '/register/success' },
      redirect: '/register/success',
    });
  });

  it('does not set reregister_approved_at when pending re-registration is not pre-approved', async () => {
    (resolveRegisterFirm as jest.Mock).mockResolvedValue({
      id: 'firm-pending',
      type: 'main',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
      medical_coverage: {
        specific_conditions: specificConditionsWithTrueCount(
          REQUIRED_HIGH_RISK_TRUE_COUNT - 1,
        ),
      },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockedCompleteConfirmRegistration).not.toHaveBeenCalled();
    expect(respond).toHaveBeenCalledWith(req, res, {
      data: { success: true, nextPath: '/register/unsuccessful' },
      redirect: '/register/unsuccessful',
    });
  });

  it('returns 500 when registration approval update fails', async () => {
    mockedCompleteConfirmRegistration.mockResolvedValueOnce({
      success: false,
      error: 'update_failed',
    });
    (resolveRegisterFirm as jest.Mock).mockResolvedValue({
      id: 'firm-pending',
      type: 'main',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
      medical_coverage: {
        specific_conditions: specificConditionsWithTrueCount(
          REQUIRED_HIGH_RISK_TRUE_COUNT,
        ),
      },
    });

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

  it('should redirect to unsuccessful if fewer than 15 conditions are "true"', async () => {
    (resolveRegisterFirm as jest.Mock).mockResolvedValue({
      id: 'firm-1',
      type: 'main',
      medical_coverage: {
        specific_conditions: specificConditionsWithTrueCount(
          REQUIRED_HIGH_RISK_TRUE_COUNT - 1,
        ),
      },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(respond).toHaveBeenCalledWith(req, res, {
      data: { success: true, nextPath: '/register/unsuccessful' },
      redirect: '/register/unsuccessful',
    });
  });

  it('should handle errors and return a 500 status', async () => {
    (resolveRegisterFirm as jest.Mock).mockRejectedValue(
      new Error('Database down'),
    );

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

  it('should handle missing session ID gracefully (showing required error)', async () => {
    req.session = {};

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        redirect: '/register/confirm-details?error=missing_fields',
      }),
    );
  });
});
