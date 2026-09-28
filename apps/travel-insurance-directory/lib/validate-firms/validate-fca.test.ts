import { fetchValidTradingNames } from './fetchValidTradingNames';
import { validateFcaNumber } from './validate-fca';

jest.mock('./fetchValidTradingNames', () => ({
  fetchValidTradingNames: jest.fn(),
}));

const mockFetchValidTradingNames = fetchValidTradingNames as jest.Mock;

describe('validateFcaNumber', () => {
  const mockFcaNumber = '538267';

  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.fetch = jest.fn();

    process.env.FCA_API_BASE_URL = 'https://test.api';
    process.env.FCA_API_KEY = 'test-key';
    process.env.FCA_API_EMAIL = 'test@test.com';
  });

  it('should return valid true, organisation name and trading names on success', async () => {
    const mockApiResponse = {
      Data: [
        {
          FRN: '538267',
          'Organisation Name': 'Test Financial Firm',
          Status: 'Authorised',
        },
      ],
    };

    mockFetchValidTradingNames.mockResolvedValue([
      'Trading Name One',
      'Trading Name Two',
    ]);

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const result = await validateFcaNumber(mockFcaNumber);

    expect(result).toEqual({
      valid: true,
      firmName: 'Test Financial Firm',
      frnNumber: mockFcaNumber,
      tradingNames: ['Trading Name One', 'Trading Name Two'],
    });

    expect(mockFetchValidTradingNames).toHaveBeenCalledWith(mockFcaNumber);
  });

  it('should return valid false and no trading names when the firm is not authorised', async () => {
    const mockApiNonAuthorisedResponse = {
      Data: [
        {
          FRN: '924111',
          'Organisation Name': 'Non-Authorised Firm',
          Status: 'Not Authorised',
        },
      ],
    };

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiNonAuthorisedResponse,
    });

    const result = await validateFcaNumber('924111');

    expect(result).toEqual({
      valid: false,
      firmName: 'Non-Authorised Firm',
      frnNumber: '924111',
      tradingNames: [],
    });

    expect(mockFetchValidTradingNames).not.toHaveBeenCalled();
  });

  it('should return invalid when the FRN is missing from the API response data', async () => {
    const mockApiResponse = {
      Data: [{}],
    };

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const result = await validateFcaNumber(mockFcaNumber);

    expect(result).toEqual({
      valid: false,
      firmName: 'Unknown',
      frnNumber: mockFcaNumber,
      tradingNames: [],
    });

    expect(mockFetchValidTradingNames).not.toHaveBeenCalled();
  });

  it('should throw an error if the API response is not ok (e.g., 404 or 500)', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(validateFcaNumber(mockFcaNumber)).rejects.toThrow(
      'An error occurred while validating the FCA number',
    );
  });

  it('should handle timeout/AbortError specifically', async () => {
    const abortError = new Error('The user aborted a request.');
    abortError.name = 'AbortError';

    (globalThis.fetch as jest.Mock).mockRejectedValue(abortError);

    await expect(validateFcaNumber(mockFcaNumber)).rejects.toThrow(
      'FCA API request timed out',
    );
  });
});
