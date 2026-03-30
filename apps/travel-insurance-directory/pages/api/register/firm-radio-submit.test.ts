jest.mock(
  'utils/api/saveRegisterProgress',
  () => ({
    saveRegisterProgress: jest.fn(),
  }),
  { virtual: true },
);

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { tidRegisterUnsuccessful } from 'lib/notify/tid-register-unsuccessful';
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

jest.mock('lib/notify/tid-register-unsuccessful');

const mockedTidRegisterUnsuccessful =
  tidRegisterUnsuccessful as jest.MockedFunction<
    typeof tidRegisterUnsuccessful
  >;

const mockedSaveRegisterProgress = saveRegisterProgress as jest.Mock;

type MockNextApiRequest = NextApiRequest & {
  session: Partial<IronSessionObject> & {
    save: jest.Mock;
    firm?: Record<string, string>;
  };
};

describe('Firm Submit API Handler', () => {
  const setupMocks = (
    body: Record<string, unknown>,
    queryParams?: Record<string, string>,
  ) => {
    const { req, res } = createMocks<MockNextApiRequest, NextApiResponse>({
      method: 'POST',
      body,
      query: {
        ...queryParams,
      },
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

  it('send email to admin when user hits an unsuccessful path', async () => {
    const fieldName = 'risk_profile_approach_question';
    const fieldValue = 'neither';

    const { req, res } = setupMocks({
      field: fieldName,
      [fieldName]: fieldValue,
      currentStep: 'step2',
      currentPath: '/register/firm',
    });

    await handler(req, res);

    expect(mockedTidRegisterUnsuccessful).toHaveBeenCalled();
  });

  it('saves the value to session and returns 200 on success', async () => {
    const fieldName = 'medicalRisk';
    const fieldValue = 'true';

    const { req, res } = setupMocks({
      field: fieldName,
      [fieldName]: fieldValue,
      currentStep: 'step1',
      currentPath: '/register/firm',
    });

    await handler(req, res);

    expect(mockedSaveRegisterProgress).toHaveBeenCalledTimes(1);
    expect(mockedSaveRegisterProgress).toHaveBeenCalledWith({
      session: req.session,
      updates: {
        [fieldName]: fieldValue,
      },
    });

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        data: { nextPath: '/register/firm/step2', success: true },
        redirect: '/register/firm/step2',
      }),
    );
  });

  it('returns 200 when called by a scenario path', async () => {
    const fieldName = 'medicalRisk';
    const fieldValue = 'true';

    const { req, res } = setupMocks({
      field: fieldName,
      [fieldName]: fieldValue,
      currentStep: 'step1',
      currentPath: '/register/scenario',
    });

    await handler(req, res);

    expect(mockedSaveRegisterProgress).toHaveBeenCalledTimes(1);
    expect(mockedSaveRegisterProgress).toHaveBeenCalledWith({
      session: req.session,
      updates: {
        [`medical_coverage/specific_conditions/${fieldName}`]: fieldValue,
      },
    });

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        data: { nextPath: '/register/scenario/step2', success: true },
        redirect: '/register/scenario/step2',
      }),
    );
  });

  it('returns redirect to confirm answers path when isChangeAnswer is set in the query', async () => {
    const fieldName = 'some-condition';
    const fieldValue = 'false';

    const { req, res } = setupMocks(
      {
        field: fieldName,
        [fieldName]: fieldValue,
        currentStep: 'step5',
        currentPath: '/register/scenario',
      },
      { isChangeAnswer: 'true' },
    );

    await handler(req, res);

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        data: { nextPath: '/register/confirm-details', success: true },
        redirect: '/register/confirm-details',
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
