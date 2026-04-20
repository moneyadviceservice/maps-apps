import { NextApiRequest, NextApiResponse } from 'next/types';

import { getAllFirmsFromCosmos } from 'lib/firms/getAllFirmsFromCosmos';
import { tidFcaValidationReport } from 'lib/notify/tid-fca-validation-report';
import { validateFcaNumber } from 'lib/validate-firms/validate-fca';
import { validateFirmPrincipals } from 'lib/validate-firms/validate-principles';
import { createMocks } from 'node-mocks-http';

import handler from './validate-firms';

jest.mock('lib/firms/getAllFirmsFromCosmos', () => ({
  getAllFirmsFromCosmos: jest.fn(),
}));
jest.mock('lib/validate-firms/validate-fca');
jest.mock('lib/validate-firms/validate-principles');
jest.mock('lib/notify/tid-fca-validation-report');

describe('FCA Validation API Handler', () => {
  const mockFirms = {
    firms: [
      {
        fca_number: '123456',
        principals: [{ individual_reference_number: 'IRN111' }],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and send no report when all validations pass', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    (getAllFirmsFromCosmos as jest.Mock).mockResolvedValue(mockFirms);
    (validateFcaNumber as jest.Mock).mockResolvedValue({
      valid: true,
      firmName: 'Test Firm',
    });
    (validateFirmPrincipals as jest.Mock).mockResolvedValue([
      { irn: 'IRN111', isValid: true },
    ]);

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      totalProcessed: 1,
      failureCount: 0,
    });
    expect(tidFcaValidationReport).not.toHaveBeenCalled();
  });

  it('should trigger tidFcaValidationReport when a firm status is invalid', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    (getAllFirmsFromCosmos as jest.Mock).mockResolvedValue(mockFirms);
    (validateFcaNumber as jest.Mock).mockResolvedValue({ valid: false });
    (validateFirmPrincipals as jest.Mock).mockResolvedValue([
      { irn: 'IRN111', isValid: true },
    ]);

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(tidFcaValidationReport).toHaveBeenCalledWith([
      expect.objectContaining({
        frn: '123456',
        issue: 'Invalid Firm Status',
      }),
    ]);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).failureCount).toBe(1);
  });

  it('should trigger tidFcaValidationReport when a principal is invalid', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    (getAllFirmsFromCosmos as jest.Mock).mockResolvedValue(mockFirms);
    (validateFcaNumber as jest.Mock).mockResolvedValue({
      valid: true,
      firmName: 'Test Firm',
    });
    (validateFirmPrincipals as jest.Mock).mockResolvedValue([
      { irn: 'IRN111', isValid: false },
    ]);

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(tidFcaValidationReport).toHaveBeenCalledWith([
      expect.objectContaining({
        issue: 'Invalid IRNs: IRN111',
      }),
    ]);
  });

  it('should distinguish between missing and invalid IRNs in the summary report', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    (getAllFirmsFromCosmos as jest.Mock).mockResolvedValue({
      firms: [{ fca_number: '123456', principals: [{}, {}] }],
    });

    (validateFcaNumber as jest.Mock).mockResolvedValue({
      valid: true,
      firmName: 'Test Firm',
    });

    (validateFirmPrincipals as jest.Mock).mockResolvedValue([
      { irn: 'Missing', isValid: false },
      { irn: '999999', isValid: false },
    ]);

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(tidFcaValidationReport).toHaveBeenCalledWith([
      expect.objectContaining({
        frn: '123456',
        issue: '1 missing IRN number(s) | Invalid IRNs: 999999',
      }),
    ]);

    expect(res._getStatusCode()).toBe(200);
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    (getAllFirmsFromCosmos as jest.Mock).mockRejectedValue(
      new Error('Cosmos Down'),
    );

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'An error occurred while validating firms',
    });
  });
});
