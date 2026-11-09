import { GetServerSidePropsContext } from 'next';

import { createSessionHelpers } from './createSessionHelpers';

const mockRedirect = {
  redirect: { destination: '/api/auth/signin', permanent: false },
};
const mockSession = { sessionKey: 'sk', save: jest.fn(), destroy: jest.fn() };
const mockLoadSessionContext = jest.fn();
const mockRedirectToLogin = jest.fn(() => mockRedirect);
const mockDestroySession = jest.fn();
const mockHydrateMsal = jest.fn();
const mockHandleSessionRefresh = jest.fn();
const mockGetMsalInstance = jest.fn();

const options = {
  getMsalInstance: mockGetMsalInstance,
  loadSessionContext: mockLoadSessionContext,
  redirectToLogin: mockRedirectToLogin,
  destroySession: mockDestroySession,
  hydrateMsal: mockHydrateMsal,
  handleSessionRefresh: mockHandleSessionRefresh,
  adminRedirectPath: '/admin-dash',
};

const context = { req: {}, res: {} } as GetServerSidePropsContext;

describe('createSessionHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadSessionContext.mockResolvedValue({
      session: mockSession,
      sessionKey: 'sk',
      parsedSessionStore: { tokenCache: 'c', account: { homeAccountId: '1' } },
    });
    mockHydrateMsal.mockResolvedValue({ homeAccountId: '1' });
    mockHandleSessionRefresh.mockResolvedValue(true);
  });

  describe('getAdminSession', () => {
    it('uses adminRedirectPath from options', async () => {
      const helpers = createSessionHelpers(options);
      mockLoadSessionContext.mockResolvedValue({
        session: { ...mockSession, isAdmin: false },
        sessionKey: 'sk',
        parsedSessionStore: {
          tokenCache: 'c',
          account: { homeAccountId: '1' },
        },
      });

      const result = await helpers.getAdminSession(context, true);

      expect(result).toEqual({
        redirect: { destination: '/admin-dash', permanent: false },
      });
    });

    it('defaults adminRedirectPath to /admin when not provided', async () => {
      const optionsWithoutAdminPath = { ...options };
      delete (optionsWithoutAdminPath as { adminRedirectPath?: string })
        .adminRedirectPath;
      const helpers = createSessionHelpers(optionsWithoutAdminPath);
      mockLoadSessionContext.mockResolvedValue({
        session: { ...mockSession, isAdmin: false },
        sessionKey: 'sk',
        parsedSessionStore: {
          tokenCache: 'c',
          account: { homeAccountId: '1' },
        },
      });

      const result = await helpers.getAdminSession(context, true);

      expect(result).toEqual({
        redirect: { destination: '/admin', permanent: false },
      });
    });

    it('returns session when requireAdmin is false', async () => {
      const helpers = createSessionHelpers(options);
      const result = await helpers.getAdminSession(context);
      expect(result).toBe(mockSession);
    });
  });

  describe('getUserSession', () => {
    it('returns session when context is valid', async () => {
      const helpers = createSessionHelpers(options);
      const result = await helpers.getUserSession(context);
      expect(result).toBe(mockSession);
    });
  });

  describe('redirectToLogin', () => {
    it('returns redirect from options', () => {
      const helpers = createSessionHelpers(options);
      expect(helpers.redirectToLogin(context)).toEqual(mockRedirect);
    });
  });
});
