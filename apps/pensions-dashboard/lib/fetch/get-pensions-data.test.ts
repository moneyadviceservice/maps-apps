import { getPensionData, UserSession } from './get-pensions-data';
import { transformPensionData } from '../utils';

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

    const result = await getPensionData(mockUserSession);

    expect(result).toEqual(mockPensionData);
    expect(transformPensionData).toHaveBeenCalledTimes(2);
  });

  it('should return pension data when retrieval is NOT complete but bypass check is set', async () => {
    process.env.PENSIONS_DATA_RETRIEVAL_COMPLETE = 'true';

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPensionDataIncomplete),
    });

    const result = await getPensionData(mockUserSession);

    expect(result).toEqual(mockPensionDataIncomplete);
    expect(transformPensionData).toHaveBeenCalledTimes(2);
  });

  it('should throw error when response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getPensionData(mockUserSession)).rejects.toThrow(
      'Failed to fetch pensions data',
    );
  });

  it('should throw error when data is not found', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(null),
    });

    await expect(getPensionData(mockUserSession)).rejects.toThrow(
      'Pensions data not found',
    );
  });

  it('should throw an error when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

    await expect(getPensionData(mockUserSession)).rejects.toThrow(
      'Fetch error',
    );
  });

  it('should throw an error when data retrieval is not complete', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPensionDataIncomplete),
    });

    await expect(getPensionData(mockUserSession)).rejects.toThrow(
      'Pensions data retrieval is not complete',
    );
  });
});
