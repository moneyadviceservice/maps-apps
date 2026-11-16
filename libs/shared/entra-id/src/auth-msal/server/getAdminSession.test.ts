import { getAdminSession } from './getAdminSession';
import {
  createGetAdminSessionOptions,
  mockDestroySession,
  mockHandleSessionRefresh,
  mockHydrateMsal,
  mockLoadSessionContext,
  mockRedirectToLogin,
  mockSession as baseMockSession,
  mockSessionContext,
  setDefaultSessionMocks,
} from './sessionHelpersTestUtils';

const mockRedirect = {
  redirect: {
    destination: '/api/auth/signin?redirectTo=%2F',
    permanent: false,
  },
};
const mockSession = { ...baseMockSession, isAdmin: true };

describe('getAdminSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setDefaultSessionMocks();
    mockLoadSessionContext.mockResolvedValue({
      session: mockSession,
      sessionKey: 'sk',
      parsedSessionStore: { tokenCache: 'c', account: { homeAccountId: '1' } },
    });
    mockRedirectToLogin.mockImplementation(() => mockRedirect);
  });

  it('returns redirect when loadSessionContext returns null', async () => {
    mockLoadSessionContext.mockResolvedValue(null);

    const result = await getAdminSession(
      mockSessionContext,
      createGetAdminSessionOptions(),
    );

    expect(mockRedirectToLogin).toHaveBeenCalledWith(mockSessionContext);
    expect(result).toEqual(mockRedirect);
  });

  it('destroys session and redirects when hydrateMsal returns null', async () => {
    mockHydrateMsal.mockResolvedValue(null);

    const result = await getAdminSession(
      mockSessionContext,
      createGetAdminSessionOptions(),
    );

    expect(mockDestroySession).toHaveBeenCalledWith(mockSession, 'sk');
    expect(mockRedirectToLogin).toHaveBeenCalledWith(mockSessionContext);
    expect(result).toEqual(mockRedirect);
  });

  it('destroys session and redirects when handleSessionRefresh returns false', async () => {
    mockHandleSessionRefresh.mockResolvedValue(false);

    const result = await getAdminSession(
      mockSessionContext,
      createGetAdminSessionOptions(),
    );

    expect(mockDestroySession).toHaveBeenCalledWith(mockSession, 'sk');
    expect(mockRedirectToLogin).toHaveBeenCalledWith(mockSessionContext);
    expect(result).toEqual(mockRedirect);
  });

  it('returns redirect to admin path when requireAdmin and session.isAdmin is false', async () => {
    const sessionNotAdmin = { ...mockSession, isAdmin: false };
    mockLoadSessionContext.mockResolvedValue({
      session: sessionNotAdmin,
      sessionKey: 'sk',
      parsedSessionStore: { tokenCache: 'c', account: { homeAccountId: '1' } },
    });

    const result = await getAdminSession(mockSessionContext, {
      ...createGetAdminSessionOptions(),
      requireAdmin: true,
      adminRedirectPath: '/admin',
    });

    expect(result).toEqual({
      redirect: { destination: '/admin', permanent: false },
    });
  });

  it('returns session when requireAdmin and session.isAdmin is true', async () => {
    const result = await getAdminSession(mockSessionContext, {
      ...createGetAdminSessionOptions(),
      requireAdmin: true,
    });

    expect(result).toBe(mockSession);
  });

  it('returns session when requireAdmin is false', async () => {
    const result = await getAdminSession(
      mockSessionContext,
      createGetAdminSessionOptions(),
    );

    expect(result).toBe(mockSession);
  });
});
