jest.mock(
  'utils/api/saveRegisterProgress',
  () => ({
    saveRegisterProgress: jest.fn(),
  }),
  { virtual: true },
);

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { createMocks } from 'node-mocks-http';
import { IronSessionObject } from 'types/iron-session';
import { respond } from 'utils/api/respond';
import { saveRegisterProgress } from 'utils/api/saveRegisterProgress';

import handler from './firm-radio-submit';

jest.mock('utils/api/respond', () => ({
  respond: jest.fn(),
}));

jest.mock('lib/sessions/withIronSession', () => ({
  withIronSession: (handler: NextApiHandler) => handler,
}));

const mockedSaveRegisterProgress = saveRegisterProgress as jest.Mock;

type MockNextApiRequest = NextApiRequest & {
  session: Partial<IronSessionObject> & {
    save: jest.Mock;
    firm?: Record<string, string>;
  };
};

describe('Firm Submit API Handler', () => {
  const setupMocks = (body: Record<string, unknown>) => {
    const { req, res } = createMocks<MockNextApiRequest, NextApiResponse>({
      method: 'POST',
      body,
    });

    req.session = {
      firm: {},
      save: jest.fn().mockResolvedValue(undefined),
    };

    return { req, res };
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockedSaveRegisterProgress.mockResolvedValue({
      success: true,
      response: { id: 'firm-123' },
    });
  });

  it('returns 400 if the field value is missing', async () => {
    const { req, res } = setupMocks({
      field: 'medicalRisk',
      currentPath: '/step-1',
    });

    await handler(req, res);

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 400,
        redirect: '/step-1',
      }),
    );

    expect(req.session.save).not.toHaveBeenCalled();
  });

  it('saves the value to session and returns 200 on success', async () => {
    const fieldName = 'medicalRisk';
    const fieldValue = 'true';

    const { req, res } = setupMocks({
      field: fieldName,
      [fieldName]: fieldValue,
      nextStepPath: '/step2',
      currentStep: 'step1',
    });

    await handler(req, res);

    expect(mockedSaveRegisterProgress).toHaveBeenCalledTimes(1);

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        data: { nextPath: '/register/firm/step2', success: true },
        redirect: '/register/firm/step2',
      }),
    );
  });

  it('handles general errors and returns 500', async () => {
    const { req, res } = setupMocks({
      field: 'medicalRisk',
      medicalRisk: 'any-value',
    });

    mockedSaveRegisterProgress.mockRejectedValue(new Error('Cosmos failure'));

    await handler(req, res);

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
        data: expect.objectContaining({
          fields: { medicalRisk: { error: 'general_error' } },
        }),
      }),
    );
  });
});
