import { getUserSession } from './getUserSession';
import {
  createGetUserSessionOptions,
  mockHandleSessionRefresh,
  mockHydrateMsal,
  mockLoadSessionContext,
  mockSession,
  mockSessionContext,
  setDefaultSessionMocks,
} from './sessionHelpersTestUtils';

describe('getUserSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setDefaultSessionMocks();
  });

  it('returns null when loadSessionContext returns null', async () => {
    mockLoadSessionContext.mockResolvedValue(null);

    const result = await getUserSession(
      mockSessionContext,
      createGetUserSessionOptions(),
    );

    expect(result).toBeNull();
  });

  it('returns null when hydrateMsal returns null', async () => {
    mockHydrateMsal.mockResolvedValue(null);

    const result = await getUserSession(
      mockSessionContext,
      createGetUserSessionOptions(),
    );

    expect(result).toBeNull();
  });

  it('returns null when handleSessionRefresh returns false', async () => {
    mockHandleSessionRefresh.mockResolvedValue(false);

    const result = await getUserSession(
      mockSessionContext,
      createGetUserSessionOptions(),
    );

    expect(result).toBeNull();
  });

  it('returns session when context is valid and refresh succeeds', async () => {
    const result = await getUserSession(
      mockSessionContext,
      createGetUserSessionOptions(),
    );

    expect(result).toBe(mockSession);
  });
});
