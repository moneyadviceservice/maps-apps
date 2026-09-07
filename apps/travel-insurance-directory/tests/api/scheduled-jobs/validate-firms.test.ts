import { NextApiRequest, NextApiResponse } from 'next';

import { getAllFirmsFromCosmos } from 'lib/firms/getAllFirmsFromCosmos';
import { tidFcaValidationReport } from 'lib/notify/tid-fca-validation-report';
import { buildResultArrays } from 'lib/scheduledJobs/services/buildResultArrays';
import { evaluateFirmState } from 'lib/scheduledJobs/services/evaluateFirmState';
import { verifyScheduledJobSecret } from 'lib/scheduledJobs/verifyScheduledJobSecret';
import handler from 'pages/api/scheduled-jobs/validate-firms';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

jest.mock('lib/account/reregistrationState', () => ({
  hasReregistrationLapsed: jest.fn(),
}));

jest.mock('lib/firms/getAllFirmsFromCosmos', () => ({
  getAllFirmsFromCosmos: jest.fn(),
}));
jest.mock('lib/notify/tid-fca-validation-report', () => ({
  tidFcaValidationReport: jest.fn(),
}));
jest.mock('lib/scheduledJobs/services/buildResultArrays', () => ({
  buildResultArrays: jest.fn(),
}));
jest.mock('lib/scheduledJobs/services/evaluateFirmState', () => ({
  evaluateFirmState: jest.fn(),
  indexTradingFirmsByMainFirmId: jest.fn(() => new Map()),
}));
jest.mock('lib/scheduledJobs/verifyScheduledJobSecret', () => ({
  verifyScheduledJobSecret: jest.fn(),
}));

const createMockRequest = (
  overrides: Partial<NextApiRequest> = {},
): NextApiRequest =>
  ({
    method: 'GET',
    headers: { 'x-scheduled-job-secret': 'valid-secret' },
    ...overrides,
  } as NextApiRequest);

type MockResponse = {
  res: NextApiResponse;
  status: jest.Mock;
  json: jest.Mock;
};

const createMockResponse = (): MockResponse => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return {
    res: { status } as unknown as NextApiResponse,
    status,
    json,
  };
};

const createMockFirm = (
  id: string,
  fcaNumber: number,
): TravelInsuranceFirmDocument =>
  ({
    id,
    fca_number: fcaNumber,
    registered_name: `Firm ${id}`,
    status: 'active',
  } as TravelInsuranceFirmDocument);

describe('API Handler: validateFirms', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (verifyScheduledJobSecret as jest.Mock).mockReturnValue(true);
    (getAllFirmsFromCosmos as jest.Mock).mockResolvedValue({
      firms: [createMockFirm('firm-1', 101)],
    });
    (evaluateFirmState as jest.Mock).mockResolvedValue({
      isParentInvalid: false,
    });
  });

  it('returns 405 if HTTP method is not GET', async () => {
    const req = createMockRequest({ method: 'POST' });
    const { res, status, json } = createMockResponse();

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('returns 401 when verifyScheduledJobSecret fails', async () => {
    (verifyScheduledJobSecret as jest.Mock).mockReturnValueOnce(false);
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {
        /** No empty */
      });

    const req = createMockRequest();
    const { res, status, json } = createMockResponse();

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Unauthorized attempt to trigger scheduled job',
    );

    consoleErrorSpy.mockRestore();
  });

  it('successfully evaluates fetched firms and returns summary payload', async () => {
    const mockFirm1 = createMockFirm('firm-1', 101);
    const mockFirm2 = createMockFirm('firm-2', 102);

    (getAllFirmsFromCosmos as jest.Mock).mockResolvedValueOnce({
      firms: [mockFirm1, mockFirm2],
    });

    (buildResultArrays as jest.Mock).mockImplementation(
      (firm, _eval, results) => {
        if (firm.fca_number === 101) {
          results.invalidFcaNumbers.push(101);
          results.newFailures.push(101);
        } else if (firm.fca_number === 102) {
          results.reactivatedFirms.push(102);
        }
        results.asyncActions.push(Promise.resolve());
      },
    );

    const req = createMockRequest();
    const { res, status, json } = createMockResponse();

    await handler(req, res);

    expect(getAllFirmsFromCosmos).toHaveBeenCalledWith({}, 1, 100);
    expect(evaluateFirmState).toHaveBeenCalledTimes(2);
    expect(evaluateFirmState).toHaveBeenCalledWith(mockFirm1, {
      tradingFirmsByMainFirmId: expect.any(Map),
    });
    expect(evaluateFirmState).toHaveBeenCalledWith(mockFirm2, {
      tradingFirmsByMainFirmId: expect.any(Map),
    });
    expect(buildResultArrays).toHaveBeenCalledTimes(2);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      success: true,
      totalProcessed: 2,
      invalidFcaNumbers: [101],
      totalFailureCount: 1,
      newFailures: [101],
      newFailuresSinceLastRun: 1,
      reactivatedFirms: [102],
      totalReactivatedFirms: 1,
    });
  });

  it('triggers tidFcaValidationReport when failures exist in summary', async () => {
    const mockFailure = { name: 'Bad Firm', frn: 999, issue: 'FCA Invalid' };

    (buildResultArrays as jest.Mock).mockImplementation(
      (_firm, _eval, results) => {
        results.failuresSummary.push(mockFailure);
      },
    );

    const req = createMockRequest();
    const { res, status } = createMockResponse();

    await handler(req, res);

    expect(tidFcaValidationReport).toHaveBeenCalledWith([mockFailure]);
    expect(status).toHaveBeenCalledWith(200);
  });

  it('returns 500 when an unhandled error occurs', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {
        /** No empty */
      });
    (getAllFirmsFromCosmos as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    const req = createMockRequest();
    const { res, status, json } = createMockResponse();

    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: 'An error occurred while validating firms',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error validating firms:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
