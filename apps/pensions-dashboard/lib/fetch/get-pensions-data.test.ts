import { DATA_NOT_FOUND, REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';
import { transformPensionData } from '../utils';
import { getPensionData, UserSession } from './get-pensions-data';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('../utils', () => ({
  transformPensionData: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn(); // Mock fetch globally
  process.env.MHPD_ISS = 'test-iss';
  process.env.MHPD_PENSIONS_DATA_URL = 'http://test-url.com';
  process.env.PENSIONS_DATA_RETRIEVAL_COMPLETE = '';
});

global.fetch = jest.fn();

describe('getPensionData', () => {
  const mhpdCorrelationId = '9e4506f7-647c-4e01-b6de-770859bbcf46';

  const mockUserSession: UserSession = {
    userSessionId: 'test-session-id',
    authorizationCode: 'test-auth-code',
  };

  const mockPensionPolicies = [
    {
      pensionArrangements: [{ id: 'pension1' }, { id: 'pension2' }],
    },
  ];

  const mockPensionData = {
    pensionsDataRetrievalComplete: true,
    pensionPolicies: mockPensionPolicies,
  };

  const mockPensionDataIncomplete = {
    pensionsDataRetrievalComplete: false,
    pensionPolicies: mockPensionPolicies,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return pension data when retrieval is complete', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPensionData),
    });

    const result = await getPensionData({
      userSession: mockUserSession,
      mhpdCorrelationId,
    });

    expect(result).toEqual(mockPensionData);
    expect(transformPensionData).toHaveBeenCalledTimes(2);
  });

  it('should return pension data when retrieval is NOT complete but bypass check is set', async () => {
    process.env.PENSIONS_DATA_RETRIEVAL_COMPLETE = 'true';

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPensionDataIncomplete),
    });

    const result = await getPensionData({
      userSession: mockUserSession,
      mhpdCorrelationId,
    });

    expect(result).toEqual(mockPensionDataIncomplete);
    expect(transformPensionData).toHaveBeenCalledTimes(2);
  });

  it('should throw error when response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(
      getPensionData({ userSession: mockUserSession, mhpdCorrelationId }),
    ).rejects.toThrow(RESPONSE_NOT_OK);
  });

  it('should throw error when data is not found', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(null),
    });

    await expect(
      getPensionData({ userSession: mockUserSession, mhpdCorrelationId }),
    ).rejects.toThrow(DATA_NOT_FOUND);
  });

  it('should throw an error when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error(REQUEST_FAILED));

    await expect(
      getPensionData({ userSession: mockUserSession, mhpdCorrelationId }),
    ).rejects.toThrow(REQUEST_FAILED);
  });

  it('should return response when mhpdCorrelationId is not provided', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPensionData),
    });

    const result = await getPensionData({ userSession: mockUserSession });

    expect(result).toEqual(mockPensionData);
    expect(transformPensionData).toHaveBeenCalledTimes(2);
  });
});
