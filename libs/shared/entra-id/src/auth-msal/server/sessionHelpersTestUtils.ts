import { GetServerSidePropsContext } from 'next';

import type { GetAdminSessionOptions, GetUserSessionOptions } from '../types';

export const mockSessionContext = {
  req: {},
  res: {},
} as GetServerSidePropsContext;

export const mockSession = {
  sessionKey: 'sk',
  save: jest.fn(),
  destroy: jest.fn(),
};

export const mockLoadSessionContext = jest.fn();
export const mockRedirectToLogin = jest.fn();
export const mockDestroySession = jest.fn();
export const mockHydrateMsal = jest.fn();
export const mockHandleSessionRefresh = jest.fn();
export const mockGetMsalInstance = jest.fn();

export const parsedSessionStore = {
  tokenCache: 'c',
  account: { homeAccountId: '1' },
};

export function createGetAdminSessionOptions(
  overrides: Partial<GetAdminSessionOptions> = {},
): GetAdminSessionOptions {
  return {
    getMsalInstance: mockGetMsalInstance,
    loadSessionContext: mockLoadSessionContext,
    redirectToLogin: mockRedirectToLogin,
    destroySession: mockDestroySession,
    hydrateMsal: mockHydrateMsal,
    handleSessionRefresh: mockHandleSessionRefresh,
    ...overrides,
  };
}

export function createGetUserSessionOptions(
  overrides: Partial<GetUserSessionOptions> = {},
): GetUserSessionOptions {
  return {
    getMsalInstance: mockGetMsalInstance,
    loadSessionContext: mockLoadSessionContext,
    destroySession: mockDestroySession,
    hydrateMsal: mockHydrateMsal,
    handleSessionRefresh: mockHandleSessionRefresh,
    ...overrides,
  };
}

export function setDefaultSessionMocks() {
  mockLoadSessionContext.mockResolvedValue({
    session: mockSession,
    sessionKey: 'sk',
    parsedSessionStore,
  });
  mockHydrateMsal.mockResolvedValue({ homeAccountId: '1' });
  mockHandleSessionRefresh.mockResolvedValue(true);
}
