import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { tidSaveProgress } from 'lib/notify/tid-register-save-progress';
import { respond } from 'utils/api/respond';

import handler from './save-progress';

jest.mock('lib/notify/tid-register-save-progress');
jest.mock('utils/api/respond');
jest.mock('lib/sessions/withIronSession', () => ({
  withIronSession: (handler: NextApiHandler) => handler,
}));

const mockedTidSaveProgress = jest.mocked(tidSaveProgress);
const mockedRespond = jest.mocked(respond);

describe('Save Progress API Handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      session: {
        userData: {
          mail: 'test@test.com',
          givenName: 'John',
        },
        savedProgressLink: 'https://link.com',
      },
      headers: {
        origin: 'http://localhost:3000',
      },
    };
    res = {};
  });

  it('returns success response when email is sent successfully', async () => {
    mockedTidSaveProgress.mockResolvedValue('success');

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockedRespond).toHaveBeenCalledWith(req, res, {
      data: { success: true, nextPath: expect.any(String) },
      redirect: expect.any(String),
    });
  });

  it('handles the case where tidSaveProgress returns an Error object', async () => {
    const mockErrorMessage = 'Notification failed';
    mockedTidSaveProgress.mockResolvedValue(new Error(mockErrorMessage));

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockedRespond).toHaveBeenCalledWith(
      req,
      res,
      expect.objectContaining({
        status: 500,
        data: expect.objectContaining({
          fields: { apiError: { error: 'general_error' } },
        }),
      }),
    );
  });

  it('uses empty strings as defaults if session data is missing', async () => {
    req.session = {};
    req.headers = { host: '' };
    mockedTidSaveProgress.mockResolvedValue('success');

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockedTidSaveProgress).toHaveBeenCalledWith('', 'http://', '');
  });
});
