import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';

import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'node:http';

import { deletePensionData } from '../../api/pension-data-service';
import {
  ChannelType,
  getDashboardChannel,
  logoutUser,
  storeCurrentUrl,
} from './navigation';
import {
  clearMhpdSessionConfig,
  getMhpdSessionConfig,
  setMhpdSessionConfig,
} from './session';

jest.mock('cookies');
jest.mock('../../api/pension-data-service');
jest.mock('./session', () => ({
  getMhpdSessionConfig: jest.fn(),
  setMhpdSessionConfig: jest.fn(),
  clearMhpdSessionConfig: jest.fn(),
}));

// Cast the mocked functions
const mockGetMhpdSessionConfig = getMhpdSessionConfig as jest.MockedFunction<
  typeof getMhpdSessionConfig
>;
const mockSetMhpdSessionConfig = setMhpdSessionConfig as jest.MockedFunction<
  typeof setMhpdSessionConfig
>;
const mockClearMhpdSessionConfig =
  clearMhpdSessionConfig as jest.MockedFunction<typeof clearMhpdSessionConfig>;

describe('Navigation Functions', () => {
  let req: Partial<GetServerSidePropsContext['req']>;
  let res: Partial<GetServerSidePropsContext['res']>;
  let cookies: jest.Mocked<Cookies>;

  beforeEach(() => {
    req = {};
    res = {};
    cookies = new Cookies(
      req as IncomingMessage,
      res as ServerResponse,
    ) as jest.Mocked<Cookies>;
    (Cookies as unknown as jest.Mock).mockImplementation(() => cookies);
    jest.clearAllMocks();
  });

  describe('getDashboardChannel', () => {
    it.each([['CONFIRMED'], ['UNCONFIRMED'], ['INCOMPLETE'], ['TIMELINE']])(
      'should return the channel from consolidated cookie as %s',
      (channel) => {
        mockGetMhpdSessionConfig.mockReturnValue({
          authorizationCode: 'auth123',
          userSessionId: 'session123',
          redirectUrl: '/redirect',
          currentUrl: '/current',
          supportCurrentUrl: '/support',
          channel: channel as ChannelType,
          pensionID: 'pension123',
          sessionTimeout: '3600',
          sessionStart: '',
        });

        const result = getDashboardChannel({
          req,
          res,
        } as GetServerSidePropsContext);
        expect(result).toEqual({ channel });
      },
    );

    it('should return an empty string if no consolidated cookie exists', () => {
      mockGetMhpdSessionConfig.mockReturnValue({
        authorizationCode: '',
        userSessionId: '',
        redirectUrl: '',
        currentUrl: '',
        supportCurrentUrl: '',
        channel: '',
        pensionID: '',
        sessionTimeout: '',
        sessionStart: '',
      });
      const result = getDashboardChannel({
        req,
        res,
      } as GetServerSidePropsContext);
      expect(result).toEqual({ channel: '' });
    });
  });

  describe('storeCurrentUrl', () => {
    beforeEach(() => {
      mockGetMhpdSessionConfig.mockReturnValue({
        authorizationCode: '',
        userSessionId: '',
        redirectUrl: '',
        currentUrl: '',
        supportCurrentUrl: '',
        channel: '',
        pensionID: '',
        sessionTimeout: '',
        sessionStart: '',
      });
    });

    it('should set the currentUrl in consolidated cookie and return the backLink and currentUrl', () => {
      const mockSessionConfig = {
        authorizationCode: 'auth123',
        userSessionId: 'session123',
        redirectUrl: '/redirect',
        currentUrl: '/previous-page',
        supportCurrentUrl: '/support',
        channel: 'CONFIRMED' as ChannelType,
        pensionID: 'pension123',
        sessionTimeout: '3600',
        sessionStart: '',
      };

      mockGetMhpdSessionConfig.mockReturnValue(mockSessionConfig);

      const resolvedUrl = '/en/page';
      const result = storeCurrentUrl({
        req,
        res,
        resolvedUrl,
      } as GetServerSidePropsContext);

      expect(mockGetMhpdSessionConfig).toHaveBeenCalled();
      expect(mockSetMhpdSessionConfig).toHaveBeenCalledWith(
        cookies,
        expect.objectContaining({ currentUrl: '/page' }),
      );
      expect(result).toEqual({
        backLink: '/previous-page',
        currentUrl: '/page',
      });
    });

    it.each`
      url                    | expectedResult
      ${''}                  | ${'/'}
      ${'/'}                 | ${'/'}
      ${'/en'}               | ${'/'}
      ${'/en/page'}          | ${'/page'}
      ${'/en/page/sub-page'} | ${'/page/sub-page'}
    `(
      'should return "$expectedResult" when given "$url"',
      ({ url, expectedResult }) => {
        const result = storeCurrentUrl({
          req,
          res,
          resolvedUrl: url,
        } as GetServerSidePropsContext);

        expect(result).toEqual({
          backLink: null,
          currentUrl: expectedResult,
        });
      },
    );

    it('should set the supportCurrentUrl in consolidated cookie when isSupport is true', () => {
      const resolvedUrl = '/en/support-page';
      storeCurrentUrl(
        {
          req,
          res,
          resolvedUrl,
        } as GetServerSidePropsContext,
        undefined,
        true,
      );

      expect(mockSetMhpdSessionConfig).toHaveBeenCalledWith(
        cookies,
        expect.objectContaining({ supportCurrentUrl: '/support-page' }),
      );
    });

    it('should clear the supportCurrentUrl in consolidated cookie when isSupport is false', () => {
      const resolvedUrl = '/en/page';
      storeCurrentUrl({
        req,
        res,
        resolvedUrl,
      } as GetServerSidePropsContext);

      expect(mockSetMhpdSessionConfig).toHaveBeenCalledWith(
        cookies,
        expect.objectContaining({ supportCurrentUrl: '' }),
      );
    });

    it.each([['CONFIRMED'], ['UNCONFIRMED'], ['INCOMPLETE'], ['TIMELINE']])(
      'should set the channel in consolidated cookie as %s',
      (channel) => {
        // Mock existing session config
        mockGetMhpdSessionConfig.mockReturnValue({
          authorizationCode: 'auth123',
          userSessionId: 'session123',
          redirectUrl: '/redirect',
          currentUrl: '/current',
          supportCurrentUrl: '/support',
          channel: '',
          pensionID: 'pension123',
          sessionTimeout: '3600',
          sessionStart: '',
        });

        const resolvedUrl = '/en/page';
        storeCurrentUrl(
          {
            req,
            res,
            resolvedUrl,
          } as GetServerSidePropsContext,
          channel as ChannelType,
        );

        expect(mockSetMhpdSessionConfig).toHaveBeenCalledWith(
          cookies,
          expect.objectContaining({ channel }),
        );
      },
    );
  });

  describe('logoutUser', () => {
    let apiReq: NextApiRequest;
    let apiRes: NextApiResponse;
    let mockDeletePensionData: jest.MockedFunction<typeof deletePensionData>;

    const mockSessionConfigWithUser = {
      userSessionId: 'test-session-id',
      authorizationCode: 'test-auth-code',
      redirectUrl: '/redirect',
      currentUrl: '/current',
      supportCurrentUrl: '/support',
      channel: 'CONFIRMED' as ChannelType,
      pensionID: 'pension123',
      sessionTimeout: '3600',
      sessionStart: '',
    };

    const mockEmptySessionConfig = {
      userSessionId: '',
      authorizationCode: '',
      redirectUrl: '',
      currentUrl: '',
      supportCurrentUrl: '',
      channel: '' as ChannelType,
      pensionID: '',
      sessionTimeout: '',
      sessionStart: '',
    };

    beforeEach(() => {
      apiReq = {} as NextApiRequest;
      apiRes = {} as NextApiResponse;
      cookies = new Cookies(apiReq, apiRes) as jest.Mocked<Cookies>;
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
        mockGetMhpdSessionConfig.mockReturnValue(mockEmptySessionConfig);

        await logoutUser(apiReq, apiRes);

        expect(mockDeletePensionData).not.toHaveBeenCalled();
        expect(mockClearMhpdSessionConfig).toHaveBeenCalledWith(cookies);
      });

      it('should clear consolidated cookie after successful DELETE', async () => {
        mockGetMhpdSessionConfig.mockReturnValue(mockSessionConfigWithUser);
        mockDeletePensionData.mockResolvedValue();

        await logoutUser(apiReq, apiRes);

        expect(mockDeletePensionData).toHaveBeenCalledWith({
          userSessionId: 'test-session-id',
        });
        expect(mockClearMhpdSessionConfig).toHaveBeenCalledWith(cookies);
      });
    });

    describe('DELETE Integration', () => {
      beforeEach(() => {
        mockGetMhpdSessionConfig.mockReturnValue(mockSessionConfigWithUser);
      });

      it('should call deletePensionData when session exists', async () => {
        mockDeletePensionData.mockResolvedValue();

        await logoutUser(apiReq, apiRes);

        expect(mockGetMhpdSessionConfig).toHaveBeenCalled();
        expect(mockDeletePensionData).toHaveBeenCalledWith({
          userSessionId: 'test-session-id',
        });
      });

      it('should handle deletePensionData errors', async () => {
        const error = new Error('Delete failed');
        mockDeletePensionData.mockRejectedValue(error);

        await expect(logoutUser(apiReq, apiRes)).rejects.toThrow(
          'Delete failed',
        );
      });

      it('should not call deletePensionData when userSessionId is empty', async () => {
        mockGetMhpdSessionConfig.mockReturnValue(mockEmptySessionConfig);

        await logoutUser(apiReq, apiRes);

        expect(mockDeletePensionData).not.toHaveBeenCalled();
      });
    });

    describe('Error Handling', () => {
      beforeEach(() => {
        mockGetMhpdSessionConfig.mockReturnValue(mockSessionConfigWithUser);
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

          await expect(logoutUser(apiReq, apiRes)).rejects.toThrow(
            error.message,
          );
          expect(mockDeletePensionData).toHaveBeenCalledWith({
            userSessionId: 'test-session-id',
          });
          expect(mockClearMhpdSessionConfig).not.toHaveBeenCalled();
        },
      );
    });

    describe('Success Flows', () => {
      it.each`
        scenario
        ${'Timeout'}
        ${'User Logout'}
      `('should complete logout for $scenario', async () => {
        mockGetMhpdSessionConfig.mockReturnValue(mockSessionConfigWithUser);
        mockDeletePensionData.mockResolvedValue();

        await expect(logoutUser(apiReq, apiRes)).resolves.toBeUndefined();
        expect(mockDeletePensionData).toHaveBeenCalledWith({
          userSessionId: 'test-session-id',
        });
        expect(mockClearMhpdSessionConfig).toHaveBeenCalledWith(cookies);
      });
    });
  });
});
