jest.mock(
  'utils/api/saveRegisterProgress',
  () => ({
    saveRegisterProgress: jest.fn(),
  }),
  { virtual: true },
);

jest.mock('lib/register/resolveRegisterFirm', () => ({
  resolveRegisterFirm: jest.fn().mockResolvedValue({
    id: 'firm-123',
    type: 'main',
    reregistered_at: null,
    reregister_approved_at: null,
    renewal_draft: null,
  }),
}));

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { tidRegisterUnsuccessful } from 'lib/notify/tid-register-unsuccessful';
import { createMocks } from 'node-mocks-http';
import { SAVE_PROGRESS_PATH } from 'types/CONSTANTS';
import { IronSessionObject } from 'types/iron-session';
import { respond } from 'utils/api/respond';
import { saveRegisterProgress } from 'utils/api/saveRegisterProgress';

import handler from 'pages/api/register/radio-submit';

jest.mock('utils/api/respond', () => ({
  respond: jest.fn(),
}));

jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: (handler: NextApiHandler) => handler,
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
    savedProgressLink?: string;
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
      db_id: 'firm-123',
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

  it('allows user to save without entering a value, returning to the current page instead of the next page', async () => {
    const fieldName = 'incomplete';
    const fieldValue = undefined;

    const { req, res } = setupMocks({
      field: fieldName,
      [fieldName]: fieldValue,
      currentStep: 'step2',
      currentPath: '/register/scenario',
      action: 'save',
    });

    await handler(req, res);

    expect(req.session.save).toHaveBeenCalledTimes(1);

    expect(req.session.savedProgressLink).toBe('/register/scenario/step2');

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        data: { nextPath: SAVE_PROGRESS_PATH, success: true },
        redirect: SAVE_PROGRESS_PATH,
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

  it('returns 500 when session has no db_id', async () => {
    const { req, res } = setupMocks({
      field: 'medicalRisk',
      medicalRisk: 'true',
      currentStep: 'step1',
      currentPath: '/register/firm',
    });
    req.session.db_id = undefined;

    await handler(req, res);

    expect(mockedSaveRegisterProgress).not.toHaveBeenCalled();
    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
        redirect: '/register/firm',
      }),
    );
  });

  it('returns 500 when saveRegisterProgress returns an error', async () => {
    const { req, res } = setupMocks({
      field: 'medicalRisk',
      medicalRisk: 'true',
      currentStep: 'step1',
      currentPath: '/register/firm',
    });

    mockedSaveRegisterProgress.mockResolvedValue({
      success: false,
      error: 'Failed to update progress',
    });

    await handler(req, res);

    expect(respond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
        redirect: '/register/firm',
      }),
    );
  });

  it('handles general errors and returns 500', async () => {
    const { req, res } = setupMocks({
      field: 'medicalRisk',
      medicalRisk: 'any-value',
      currentStep: 'step1',
      currentPath: '/register/firm',
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
