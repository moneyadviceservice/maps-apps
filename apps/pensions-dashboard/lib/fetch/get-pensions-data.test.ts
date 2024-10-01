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

  jest.spyOn(console, 'error').mockImplementation(() => null);

  process.env.MHPD_ISS = 'test-iss';
  process.env.MHPD_PENSIONS_DATA_URL = 'http://test-url.com';
});

afterEach(() => {
  jest.spyOn(console, 'error').mockRestore();
});

global.fetch = jest.fn();

describe('getPensionData', () => {
  const mockUserSession: UserSession = {
    userSessionId: 'test-session-id',
    authorizationCode: 'test-auth-code',
  };

  const mockPensionData = {
    pensionsDataRetrievalComplete: true,
    pensionPolicies: [
      {
        pensionArrangements: [{ id: 'pension1' }, { id: 'pension2' }],
      },
    ],
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
});
