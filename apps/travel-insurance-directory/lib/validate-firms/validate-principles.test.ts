import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { validateFirmPrincipals } from './validate-principles';

describe('validateFirmPrincipals', () => {
  const fcaNumber = '123456';
  const mockPrincipals = [
    { individual_reference_number: 'IRN111' },
    { individual_reference_number: 'IRN222' },
  ] as TravelInsuranceFirmDocument['principals'];

  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.fetch = jest.fn();
    process.env.FCA_API_BASE_URL = 'https://test.api';
  });

  it('should return isValid: true for found IRNs and handle short-circuiting', async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          Status: 'FSR-API-02-05-00',
          Data: [{ IRN: 'IRN111' }],
          ResultInfo: { Next: 'https://test.api/page2' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          Status: 'FSR-API-02-05-00',
          Data: [{ IRN: 'IRN222' }],
          ResultInfo: { Next: 'https://test.api/page3' },
        }),
      });

    const results = await validateFirmPrincipals(fcaNumber, mockPrincipals);

    expect(results).toEqual([
      { irn: 'IRN111', isValid: true },
      { irn: 'IRN222', isValid: true },
    ]);

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('should return isValid: false for missing or empty IRNs without calling the API', async () => {
    const dirtyPrincipals = [
      { individual_reference_number: '' },
      { individual_reference_number: undefined },
    ] as TravelInsuranceFirmDocument['principals'];

    const results = await validateFirmPrincipals(fcaNumber, dirtyPrincipals);

    expect(results).toEqual([
      { irn: 'Missing', isValid: false },
      { irn: 'Missing', isValid: false },
    ]);
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

    const results = await validateFirmPrincipals(fcaNumber, [
      { individual_reference_number: 'NOT_HERE' },
    ] as TravelInsuranceFirmDocument['principals']);

    expect(results[0].isValid).toBe(false);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle API failures gracefully by returning all as invalid', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const results = await validateFirmPrincipals(fcaNumber, mockPrincipals);

    expect(results.every((r) => r.isValid === false)).toBe(true);
  });

  it('should handle a mix of valid and invalid IRNs', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        Status: 'FSR-API-02-05-00',
        Data: [{ IRN: 'IRN111' }],
        ResultInfo: { Next: undefined },
      }),
    });

    const results = await validateFirmPrincipals(fcaNumber, mockPrincipals);

    expect(results).toEqual([
      { irn: 'IRN111', isValid: true },
      { irn: 'IRN222', isValid: false },
    ]);
  });
});
