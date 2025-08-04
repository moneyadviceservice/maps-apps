import { GetServerSidePropsContext } from 'next';

import { getIronSession } from 'iron-session';
import { getStore } from '@netlify/blobs';

import { destroySession } from './destroySession';
import { loadSessionContext } from './loadSessionContext';

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}));

jest.mock('@netlify/blobs', () => ({
  getStore: jest.fn(),
}));

jest.mock('./destroySession', () => ({
  destroySession: jest.fn(),
}));

describe('loadSessionContext', () => {
  const mockContext = {
    req: {},
    res: {},
  } as GetServerSidePropsContext;

  const sessionKey = 'test-key';

  const mockSession = {
    sessionKey,
    destroy: jest.fn(),
  };

  const mockStore = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (getIronSession as jest.Mock).mockResolvedValue(mockSession);
    (getStore as jest.Mock).mockReturnValue(mockStore);
  });

  it('returns null if sessionKey is missing', async () => {
    (getIronSession as jest.Mock).mockResolvedValue({ destroy: jest.fn() });

    const result = await loadSessionContext(mockContext);
    expect(result).toBeNull();
  });

  it('returns null and destroys session if store.get returns null', async () => {
    mockStore.get.mockResolvedValue(null);

    const result = await loadSessionContext(mockContext);
    expect(mockStore.get).toHaveBeenCalledWith(sessionKey);
    expect(mockSession.destroy).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('returns null and destroys session on JSON parse failure', async () => {
    mockStore.get.mockResolvedValue('invalid json');

    const result = await loadSessionContext(mockContext);
    expect(destroySession).toHaveBeenCalledWith(
      mockSession,
      sessionKey,
      mockStore,
    );
    expect(result).toBeNull();
  });

  it('returns session context when everything is valid', async () => {
    const parsedSessionStore = {
      tokenCache: 'abc',
      account: { homeAccountId: '123' },
    };

    mockStore.get.mockResolvedValue(JSON.stringify(parsedSessionStore));

    const result = await loadSessionContext(mockContext);

    expect(result).toEqual({
      session: mockSession,
      sessionKey,
      parsedSessionStore,
    });
  });
});
