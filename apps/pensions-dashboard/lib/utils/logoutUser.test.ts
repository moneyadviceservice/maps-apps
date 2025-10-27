import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { COOKIE_OPTIONS } from '../constants';
import { deletePensionData } from '../fetch/delete-pension-data';
import { logoutUser } from './logoutUser';

jest.mock('cookies');
jest.mock('../fetch/delete-pension-data');

describe('logoutUser', () => {
  let req: NextApiRequest;
  let res: NextApiResponse;
  let cookies: jest.Mocked<Cookies>;
  let mockDeletePensionData: jest.MockedFunction<typeof deletePensionData>;

  const mockSessionConfigWithUser = {
    userSessionId: 'test-session-id',
    authorizationCode: 'test-auth-code',
    redirectUrl: '/redirect',
    currentUrl: '/current',
    supportCurrentUrl: '/support',
    channel: 'CONFIRMED',
    pensionID: 'pension123',
    sessionTimeout: '3600',
  };

  const mockEmptySessionConfig = {
    userSessionId: '',
    authorizationCode: '',
    redirectUrl: '',
    currentUrl: '',
    supportCurrentUrl: '',
    channel: '',
    pensionID: '',
    sessionTimeout: '',
  };

  beforeEach(() => {
    req = {} as NextApiRequest;
    res = {} as NextApiResponse;
    cookies = new Cookies(req, res) as jest.Mocked<Cookies>;
    mockDeletePensionData = deletePensionData as jest.MockedFunction<
      typeof deletePensionData
    >;

    (Cookies as unknown as jest.Mock).mockImplementation(() => cookies);
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Cookie Management', () => {
    it('should clear consolidated cookie when no session', async () => {
      cookies.get.mockReturnValue(undefined); // No session config

      await logoutUser(req, res);

      expect(mockDeletePensionData).not.toHaveBeenCalled();
      expect(cookies.set).toHaveBeenCalledWith('mhpdSessionConfig', '', {
        ...COOKIE_OPTIONS,
        expires: new Date(0),
      });
    });

    it('should clear consolidated cookie after successful DELETE', async () => {
      cookies.get.mockReturnValue(JSON.stringify(mockSessionConfigWithUser));
      mockDeletePensionData.mockResolvedValue();

      await logoutUser(req, res);

      expect(mockDeletePensionData).toHaveBeenCalledWith({
        userSessionId: 'test-session-id',
      });
      expect(cookies.set).toHaveBeenCalledWith('mhpdSessionConfig', '', {
        ...COOKIE_OPTIONS,
        expires: new Date(0),
      });
    });
  });

  describe('DELETE Integration', () => {
    beforeEach(() => {
      cookies.get.mockReturnValue(JSON.stringify(mockSessionConfigWithUser));
    });

    it('should call deletePensionData when session exists', async () => {
      mockDeletePensionData.mockResolvedValue();

      await logoutUser(req, res);

      expect(cookies.get).toHaveBeenCalledWith('mhpdSessionConfig');
      expect(mockDeletePensionData).toHaveBeenCalledWith({
        userSessionId: 'test-session-id',
      });
    });

    it('should handle deletePensionData errors', async () => {
      const error = new Error('Delete failed');
      mockDeletePensionData.mockRejectedValue(error);

      await expect(logoutUser(req, res)).rejects.toThrow('Delete failed');
    });

    it('should not call deletePensionData when userSessionId is empty', async () => {
      cookies.get.mockReturnValue(JSON.stringify(mockEmptySessionConfig));

      await logoutUser(req, res);

      expect(mockDeletePensionData).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      cookies.get.mockReturnValue(JSON.stringify(mockSessionConfigWithUser));
    });

    it.each`
      errorType      | scenario         | error
      ${'5XX Error'} | ${'Timeout'}     | ${Object.assign(new Error('500: Server Error'), { status: 500 })}
      ${'Network'}   | ${'User Logout'} | ${new Error('Network error')}
      ${'Service'}   | ${'Timeout'}     | ${Object.assign(new Error('503: Service Unavailable'), { status: 503 })}
      ${'DELETE'}    | ${'User Logout'} | ${new Error('DELETE failed')}
    `(
      'should prevent logout on $errorType error during $scenario',
      async ({ error }) => {
        mockDeletePensionData.mockRejectedValue(error);

        await expect(logoutUser(req, res)).rejects.toThrow(error.message);
        expect(mockDeletePensionData).toHaveBeenCalledWith({
          userSessionId: 'test-session-id',
        });
        expect(cookies.set).not.toHaveBeenCalled();
      },
    );
  });

  describe('Success Flows', () => {
    it.each`
      scenario
      ${'Timeout'}
      ${'User Logout'}
    `('should complete logout for $scenario', async () => {
      cookies.get.mockReturnValue(JSON.stringify(mockSessionConfigWithUser));
      mockDeletePensionData.mockResolvedValue();

      await expect(logoutUser(req, res)).resolves.toBeUndefined();
      expect(mockDeletePensionData).toHaveBeenCalledWith({
        userSessionId: 'test-session-id',
      });
      expect(cookies.set).toHaveBeenCalledWith('mhpdSessionConfig', '', {
        ...COOKIE_OPTIONS,
        expires: new Date(0),
      });
    });
  });
});
