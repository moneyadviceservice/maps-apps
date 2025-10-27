import { AccountInfo, ConfidentialClientApplication } from '@azure/msal-node';

import { hydrateMsal } from './hydrateMsal';

describe('hydrateMsal', () => {
  const mockAccount: AccountInfo = {
    homeAccountId: 'abc123',
    environment: '',
    tenantId: '',
    username: '',
    localAccountId: '',
  };

  const mockParsed = {
    tokenCache: 'serialized-token-cache',
    account: mockAccount,
  };

  const mockDeserialize = jest.fn();
  const mockGetAllAccounts = jest.fn();

  const mockTokenCache = {
    deserialize: mockDeserialize,
    getAllAccounts: mockGetAllAccounts,
  };

  const mockMsalInstance = {
    getTokenCache: jest.fn().mockReturnValue(mockTokenCache),
  } as unknown as ConfidentialClientApplication;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null if tokenCache or account is missing', async () => {
    const result1 = await hydrateMsal(mockMsalInstance, {
      tokenCache: '',
      account: mockAccount,
    });
    expect(result1).toBeNull();

    const result2 = await hydrateMsal(mockMsalInstance, {
      tokenCache: 'cache',
      account: null,
    });
    expect(result2).toBeNull();
  });

  it('returns the matching account if found', async () => {
    mockGetAllAccounts.mockResolvedValue([
      { homeAccountId: 'abc123' },
      { homeAccountId: 'def456' },
    ]);

    const result = await hydrateMsal(mockMsalInstance, mockParsed);
    expect(mockDeserialize).toHaveBeenCalledWith('serialized-token-cache');
    expect(result?.homeAccountId).toBe('abc123');
  });

  it('returns null if no matching account is found', async () => {
    mockGetAllAccounts.mockResolvedValue([{ homeAccountId: 'not-a-match' }]);

    const result = await hydrateMsal(mockMsalInstance, mockParsed);
    expect(result).toBeNull();
  });

  it('returns null if getTokenCache throws', async () => {
    mockDeserialize.mockImplementation(() => {
      throw new Error('Broken');
    });

    const result = await hydrateMsal(mockMsalInstance, mockParsed);
    expect(result).toBeNull();
  });
});
