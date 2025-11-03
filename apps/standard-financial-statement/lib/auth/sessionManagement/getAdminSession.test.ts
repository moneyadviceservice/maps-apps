import { GetServerSidePropsContext } from 'next';

import * as redirectUtils from '../utils/redirectToLogin';
import * as destroy from './destroySession';
import { getAdminSession } from './getAdminSession';
import * as refresh from './handleSessionRefresh';
import * as hydrate from './hydrateMsal';
import * as load from './loadSessionContext';

jest.mock('@netlify/blobs', () => ({
  getStore: jest.fn(),
}));

jest.mock('@azure/msal-node');

jest.mock('../utils/redirectToLogin', () => ({
  redirectToLogin: jest.fn(() => ({
    redirect: { destination: '/login', permanent: false },
  })),
}));

jest.mock('./destroySession', () => ({
  destroySession: jest.fn(),
}));

jest.mock('./handleSessionRefresh', () => ({
  handleSessionRefresh: jest.fn(),
}));

jest.mock('./hydrateMsal', () => ({
  hydrateMsal: jest.fn(),
}));

jest.mock('./loadSessionContext', () => ({
  loadSessionContext: jest.fn(),
}));

describe('getAdminSession', () => {
  const mockContext = {} as GetServerSidePropsContext;
  const session = { isAdmin: true };
  const sessionKey = 'session-key';
  const parsedSessionStore = { some: 'data' };

  beforeEach(() => {
    jest.clearAllMocks();
    (load.loadSessionContext as jest.Mock).mockResolvedValue({
      session,
      sessionKey,
      parsedSessionStore,
    });
    (hydrate.hydrateMsal as jest.Mock).mockResolvedValue({ account: 'user' });
    (refresh.handleSessionRefresh as jest.Mock).mockResolvedValue(true);
  });

  it('returns session if everything is valid', async () => {
    const result = await getAdminSession(mockContext);
    expect(result).toEqual(session);
  });

  it('redirects if no session context', async () => {
    (load.loadSessionContext as jest.Mock).mockResolvedValue(null);
    const result = await getAdminSession(mockContext);
    expect(redirectUtils.redirectToLogin).toHaveBeenCalled();
    expect(result).toEqual({
      redirect: { destination: '/login', permanent: false },
    });
  });

  it('redirects and destroys session if account is not found', async () => {
    (hydrate.hydrateMsal as jest.Mock).mockResolvedValue(null);

    await getAdminSession(mockContext);
    expect(destroy.destroySession).toHaveBeenCalled();
    expect(redirectUtils.redirectToLogin).toHaveBeenCalled();
  });

  it('redirects and destroys session if session refresh fails', async () => {
    (refresh.handleSessionRefresh as jest.Mock).mockResolvedValue(false);

    await getAdminSession(mockContext);
    expect(destroy.destroySession).toHaveBeenCalled();
    expect(redirectUtils.redirectToLogin).toHaveBeenCalled();
  });

  it('redirects if requireAdmin is true but session is not admin', async () => {
    const nonAdminSession = { isAdmin: false };
    (load.loadSessionContext as jest.Mock).mockResolvedValue({
      session: nonAdminSession,
      sessionKey,
      parsedSessionStore,
    });

    const result = await getAdminSession(mockContext, true);
    expect(result).toEqual({
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    });
  });
});
