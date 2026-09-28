import type { Principal } from 'types/travel-insurance-firm';

import { validateFirmPrincipals } from './validate-principles';

describe('validateFirmPrincipals', () => {
  const fcaNumber = '123456';
  const mockPrincipal = {
    individual_reference_number: 'IRN111',
  } as Principal;

  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.fetch = jest.fn();
    process.env.FCA_API_BASE_URL = 'https://test.api';
  });

  it('should return isValid: true for found IRN', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        Status: 'FSR-API-02-05-00',
        Data: [{ IRN: 'IRN111' }],
        ResultInfo: { Next: undefined },
      }),
    });

    const results = await validateFirmPrincipals(fcaNumber, mockPrincipal);

    expect(results).toEqual([{ irn: 'IRN111', isValid: true }]);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('should return isValid: false for missing or empty IRN without calling the API', async () => {
    const results = await validateFirmPrincipals(fcaNumber, {
      individual_reference_number: '',
    } as Principal);

    expect(results).toEqual([{ irn: 'Missing', isValid: false }]);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('should return empty array when principal is null', async () => {
    const results = await validateFirmPrincipals(fcaNumber, null);
    expect(results).toEqual([]);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('should continue to the end of pagination if an IRN is not found', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        Status: 'FSR-API-02-05-00',
        Data: [{ IRN: 'SOME_OTHER_GUY' }],
        ResultInfo: { Next: undefined },
      }),
    });

    const results = await validateFirmPrincipals(fcaNumber, {
      individual_reference_number: 'NOT_HERE',
    } as Principal);

    expect(results[0].isValid).toBe(false);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle API failures gracefully by returning invalid', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const results = await validateFirmPrincipals(fcaNumber, mockPrincipal);

    expect(results).toEqual([{ irn: 'IRN111', isValid: false }]);
  });

  it('should return isValid: false when IRN not in API response', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        Status: 'FSR-API-02-05-00',
        Data: [{ IRN: 'OTHER' }],
        ResultInfo: { Next: undefined },
      }),
    });

    const results = await validateFirmPrincipals(fcaNumber, mockPrincipal);

    expect(results).toEqual([{ irn: 'IRN111', isValid: false }]);
  });
});
