import { updateFirm } from 'lib/firms/updateFirm';
import { tidInvalidFrn } from 'lib/notify/tid-invalid-frn';
import { tidReregistration } from 'lib/notify/tid-reregistration';
import { EvaluateFirmStateResult } from 'lib/scheduledJobs/services/evaluateFirmState';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { buildResultArrays, ValidationResultArrays } from './buildResultArrays';

jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: jest.fn().mockReturnValue(Promise.resolve()),
}));
jest.mock('lib/notify/tid-invalid-frn', () => ({
  tidInvalidFrn: jest.fn().mockReturnValue(Promise.resolve()),
}));
jest.mock('lib/notify/tid-reregistration', () => ({
  tidReregistration: jest.fn().mockReturnValue(Promise.resolve()),
}));

const createMockFirm = (
  overrides: Partial<TravelInsuranceFirmDocument> = {},
): TravelInsuranceFirmDocument =>
  ({
    id: 'firm-123',
    fca_number: 999888,
    registered_name: 'Acme Insurance',
    status: 'active',
    ...overrides,
  } as TravelInsuranceFirmDocument);

const createMockEvaluation = (
  overrides: Partial<EvaluateFirmStateResult> = {},
): EvaluateFirmStateResult => ({
  isParentInvalid: false,
  failure: null,
  firmUpdates: {},
  relatedFirmUpdates: [],
  notifyTarget: null,
  ...overrides,
});

const createEmptyResults = (): ValidationResultArrays => ({
  failuresSummary: [],
  invalidFcaNumbers: [],
  reactivatedFirms: [],
  newFailures: [],
  asyncActions: [],
});

describe('buildResultArrays', () => {
  let results: ValidationResultArrays;

  beforeEach(() => {
    jest.clearAllMocks();
    results = createEmptyResults();
  });

  it('populates invalidFcaNumbers when isParentInvalid is true', () => {
    const firm = createMockFirm({ fca_number: 111222 });
    const evaluation = createMockEvaluation({ isParentInvalid: true });

    buildResultArrays(firm, evaluation, results);

    expect(results.invalidFcaNumbers).toEqual([111222]);
  });

  it('populates failuresSummary when a failure object exists', () => {
    const firm = createMockFirm();
    const failureObj = {
      name: 'Acme Insurance',
      frn: 999888,
      issue: 'Invalid Parent Firm Status',
    };
    const evaluation = createMockEvaluation({ failure: failureObj });

    buildResultArrays(firm, evaluation, results);

    expect(results.failuresSummary).toEqual([failureObj]);
  });

  it('tracks newFailures when status update is "hidden"', () => {
    const firm = createMockFirm({ fca_number: 555666 });
    const evaluation = createMockEvaluation({
      firmUpdates: { status: 'hidden' },
    });

    buildResultArrays(firm, evaluation, results);

    expect(results.newFailures).toEqual([555666]);
  });

  it('tracks reactivatedFirms when status update is "active"', () => {
    const firm = createMockFirm({ fca_number: 777888 });
    const evaluation = createMockEvaluation({
      firmUpdates: { status: 'active' },
    });

    buildResultArrays(firm, evaluation, results);

    expect(results.reactivatedFirms).toEqual([777888]);
  });

  it('pushes updateFirm promise into asyncActions when firmUpdates has keys and firm has an id', () => {
    const firm = createMockFirm({ id: 'firm-abc' });
    const firmUpdates = { status: 'hidden' as const };
    const evaluation = createMockEvaluation({ firmUpdates });

    buildResultArrays(firm, evaluation, results);

    expect(updateFirm).toHaveBeenCalledWith('firm-abc', firmUpdates);
    expect(results.asyncActions).toHaveLength(1);
  });

  it('queues relatedFirmUpdates without notifications', () => {
    const firm = createMockFirm({ id: 'main-1' });
    const evaluation = createMockEvaluation({
      relatedFirmUpdates: [
        {
          id: 'trading-1',
          updates: {
            status: 'hidden',
            hidden_reason: 'reregistration_required',
          },
        },
      ],
    });

    buildResultArrays(firm, evaluation, results);

    expect(updateFirm).toHaveBeenCalledWith('trading-1', {
      status: 'hidden',
      hidden_reason: 'reregistration_required',
    });
    expect(results.asyncActions).toHaveLength(1);
    expect(tidReregistration).not.toHaveBeenCalled();
  });

  it('does not trigger updateFirm if firm has no id', () => {
    const firm = createMockFirm({ id: undefined });
    const evaluation = createMockEvaluation({
      firmUpdates: { status: 'hidden' },
    });

    buildResultArrays(firm, evaluation, results);

    expect(updateFirm).not.toHaveBeenCalled();
  });

  it('queues tidReregistration notification when emailTemplate is "tidReregistration"', () => {
    const firm = createMockFirm();
    const evaluation = createMockEvaluation({
      notifyTarget: {
        firstName: 'Jane',
        email: 'jane@example.com',
        emailTemplate: 'tidReregistration',
      },
    });

    buildResultArrays(firm, evaluation, results);

    expect(tidReregistration).toHaveBeenCalledWith('Jane', 'jane@example.com');
    expect(results.asyncActions).toHaveLength(1);
  });

  it('queues tidInvalidFrn notification when emailTemplate is "tidInvalidFrn"', () => {
    const firm = createMockFirm();
    const evaluation = createMockEvaluation({
      notifyTarget: {
        firstName: 'John',
        email: 'john@example.com',
        emailTemplate: 'tidInvalidFrn',
      },
    });

    buildResultArrays(firm, evaluation, results);

    expect(tidInvalidFrn).toHaveBeenCalledWith('John', 'john@example.com');
    expect(results.asyncActions).toHaveLength(1);
  });

  it('logs a console warning when an unknown emailTemplate is provided', () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {
        /** No empty */
      });
    const firm = createMockFirm({ fca_number: 12345 });

    const evaluation = createMockEvaluation({
      notifyTarget: {
        firstName: 'Alex',
        email: 'alex@example.com',
        emailTemplate: 'unknownTemplate' as 'tidInvalidFrn',
      },
    });

    buildResultArrays(firm, evaluation, results);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Unknown email template for firm 12345: unknownTemplate',
    );
    expect(results.asyncActions).toHaveLength(0);

    consoleWarnSpy.mockRestore();
  });
});
