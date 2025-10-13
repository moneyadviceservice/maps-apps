import { GetServerSidePropsContext } from 'next';

import * as msal from '@azure/msal-node';
import * as netlifyBlobs from '@netlify/blobs';

import { getUserSession } from './getUserSession';
import * as refresh from './handleSessionRefresh';
import * as hydrate from './hydrateMsal';
import * as loadSession from './loadSessionContext';

jest.mock('@netlify/blobs', () => ({
  getStore: jest.fn(),
}));

jest.mock('@azure/msal-node');

jest.mock('./loadSessionContext', () => ({
  loadSessionContext: jest.fn(),
}));

jest.mock('./hydrateMsal', () => ({
  hydrateMsal: jest.fn(),
}));

jest.mock('./handleSessionRefresh', () => ({
  handleSessionRefresh: jest.fn(),
}));

describe('getUserSession', () => {
  const mockContext = {} as GetServerSidePropsContext;

  const mockSession = { isLoggedIn: true };
  const sessionKey = 'key123';
  const parsedSessionStore = { userId: 'abc123' };

  beforeEach(() => {
    jest.clearAllMocks();

    (netlifyBlobs.getStore as jest.Mock).mockReturnValue({});

    (loadSession.loadSessionContext as jest.Mock).mockResolvedValue({
      session: mockSession,
      sessionKey,
      parsedSessionStore,
    });

    (hydrate.hydrateMsal as jest.Mock).mockResolvedValue({ accountId: 'xyz' });

    (refresh.handleSessionRefresh as jest.Mock).mockResolvedValue(true);

    (msal.ConfidentialClientApplication as jest.Mock).mockImplementation(
      () => ({
        acquireTokenSilent: jest.fn(),
      }),
    );
  });

  const expectNull = async () => {
    const result = await getUserSession(mockContext);
    expect(result).toBeNull();
  };

  it('returns session if context and refresh succeed', async () => {
    const result = await getUserSession(mockContext);
    expect(result).toEqual(mockSession);
    expect(loadSession.loadSessionContext).toHaveBeenCalled();
    expect(hydrate.hydrateMsal).toHaveBeenCalled();
    expect(refresh.handleSessionRefresh).toHaveBeenCalled();
  });

  it('returns null if no session context is found', async () => {
    (loadSession.loadSessionContext as jest.Mock).mockResolvedValue(null);

    expectNull();
  });

  it('returns null if hydrateMsal returns null', async () => {
    (hydrate.hydrateMsal as jest.Mock).mockResolvedValue(null);

    expectNull();
  });

  it('returns null if handleSessionRefresh fails', async () => {
    (refresh.handleSessionRefresh as jest.Mock).mockResolvedValue(false);

    expectNull();
  });
});
