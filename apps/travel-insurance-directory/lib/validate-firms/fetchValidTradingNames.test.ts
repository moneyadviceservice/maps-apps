import { fetchTradingNamesForFirmFcaNumber } from 'lib/fca/fetchTradingNamesForFirm';

import { fetchValidTradingNames } from './fetchValidTradingNames';

jest.mock('lib/fca/fetchTradingNamesForFirm', () => ({
  fetchTradingNamesForFirmFcaNumber: jest.fn(),
}));

const mockFetchTradingNamesForFirmFcaNumber =
  fetchTradingNamesForFirmFcaNumber as jest.Mock;

describe('fetchValidTradingNames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array for an invalid FRN', async () => {
    const result = await fetchValidTradingNames('abc');

    expect(result).toEqual([]);
    expect(mockFetchTradingNamesForFirmFcaNumber).not.toHaveBeenCalled();
  });

  it('should return trading names when fetch succeeds', async () => {
    mockFetchTradingNamesForFirmFcaNumber.mockResolvedValue({
      ok: true,
      names: ['Trading Name 1', 'Trading Name 2'],
    });

    const result = await fetchValidTradingNames('123456');

    expect(mockFetchTradingNamesForFirmFcaNumber).toHaveBeenCalledWith(123456);
    expect(result).toEqual(['Trading Name 1', 'Trading Name 2']);
  });

  it('should return an empty array when fetch fails', async () => {
    mockFetchTradingNamesForFirmFcaNumber.mockResolvedValue({
      ok: false,
      error: 'FCA error',
    });

    const result = await fetchValidTradingNames('54321');

    expect(result).toEqual([]);
  });

  it('should return an empty array when fetch throws an error', async () => {
    mockFetchTradingNamesForFirmFcaNumber.mockRejectedValue(
      new Error('Network error'),
    );

    const result = await fetchValidTradingNames('98532');

    expect(result).toEqual([]);
  });
});
