import { validateIRN } from './validateIRN';

interface FCAIndividualResponse {
  Status: string;
  Data?: { Status: string; URL: string; IRN: string; Name: string }[];
}

describe('validateIRN', () => {
  const mockIrn = '123456';
  const mockFca = 'abcdef';

  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.fetch = jest.fn();
  });

  it('should return true when the API returns a successful status', async () => {
    const mockResponse: FCAIndividualResponse = {
      Status: 'FSR-API-02-05-00',
      Data: [
        {
          Status: 'Approved',
          URL: '...',
          IRN: 'RSW01092',
          Name: 'Richard Stuart Watson',
        },
        {
          Status: 'Approved',
          URL: '...',
          IRN: '123456',
          Name: 'Walter Alexander McCulloch',
        },
      ],
    };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await validateIRN(mockIrn, mockFca);

    expect(result).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/Firm/${mockFca}`),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'X-Auth-Key': expect.any(String),
        }),
      }),
    );
  });

  it('should return false when fca number is missing', async () => {
    const mockResponse: FCAIndividualResponse = { Status: 'WRONG_STATUS' };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await validateIRN(mockIrn);
    expect(result).toBe(false);
  });

  it('should return false when the status code is incorrect', async () => {
    const mockResponse: FCAIndividualResponse = { Status: 'WRONG_STATUS' };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await validateIRN(mockIrn, mockFca);
    expect(result).toBe(false);
  });

  it('should return false when fetch fails (response.ok is false)', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const result = await validateIRN(mockIrn, mockFca);
    expect(result).toBe(false);
  });

  it('should return false and log error when an exception occurs', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /** No empty */
    });
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    );

    const result = await validateIRN(mockIrn, mockFca);

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
