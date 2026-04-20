import { validateFcaNumber } from './validate-fca';

describe('validateFcaNumber', () => {
  const mockFcaNumber = '538267';

  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.fetch = jest.fn();

    process.env.FCA_API_BASE_URL = 'https://test.api';
    process.env.FCA_API_KEY = 'test-key';
    process.env.FCA_API_EMAIL = 'test@test.com';
  });

  it('should return valid true and the organisation name on success', async () => {
    const mockApiResponse = {
      Data: [
        {
          FRN: '538267',
          'Organisation Name': 'Test Financial Firm',
          Status: 'Authorised',
        },
      ],
    };

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const result = await validateFcaNumber(mockFcaNumber);

    expect(result).toEqual({
      valid: true,
      firmName: 'Test Financial Firm',
      frnNumber: mockFcaNumber,
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/Firm/${mockFcaNumber}`),
      expect.any(Object),
    );
  });

  it('should return valid false when the firm is not authorised', async () => {
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
    });
  });

  it('should throw an error if the FRN is missing from the API response data', async () => {
    const mockApiResponse = { Data: [{}] };

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    await expect(validateFcaNumber(mockFcaNumber)).rejects.toThrow(
      'An error occurred while validating the FCA number',
    );
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
