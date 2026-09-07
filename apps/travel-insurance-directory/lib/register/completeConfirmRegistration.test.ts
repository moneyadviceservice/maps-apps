import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import { createEligibleAdminFirm } from 'lib/admin/shared/testing/adminFirmFixtures';
import { addMonths } from 'date-fns';

import { completeConfirmRegistration } from './completeConfirmRegistration';

const mockedUpdateFirm = jest.fn();
jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: (...args: unknown[]) => mockedUpdateFirm(...args),
}));

const mockedFetchTradingDocsByMainFirmId = jest.fn();
jest.mock('lib/account/tradingFirm', () => ({
  fetchTradingDocsByMainFirmId: (...args: unknown[]) =>
    mockedFetchTradingDocsByMainFirmId(...args),
}));

describe('completeConfirmRegistration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUpdateFirm.mockResolvedValue({ success: true });
    mockedFetchTradingDocsByMainFirmId.mockResolvedValue({
      success: true,
      response: [],
    });
  });

  it('skips Cosmos updates in CI e2e for first-time registration', async () => {
    const previousCi = process.env.CI;
    process.env.CI = 'true';

    const result = await completeConfirmRegistration(
      createMockFirm({ id: 'firm-1', approved_at: null }),
    );

    expect(result).toEqual({ success: true });
    expect(mockedFetchTradingDocsByMainFirmId).not.toHaveBeenCalled();
    expect(mockedUpdateFirm).not.toHaveBeenCalled();

    process.env.CI = previousCi;
  });

  it('promotes renewal draft to Cosmos in CI when pending re-registration', async () => {
    const previousCi = process.env.CI;
    process.env.CI = 'true';

    const approvedAt = '2025-01-15T12:00:00.000Z';
    const confirmNow = addMonths(new Date(approvedAt), 11);
    confirmNow.setDate(confirmNow.getDate() + 5);

    const firm = createMockFirm({
      id: 'firm-renew-ci',
      approved_at: approvedAt,
      reregistered_at: confirmNow.toISOString(),
      reregister_approved_at: null,
      renewal_draft: {
        covered_by_ombudsman_question: 'true',
        medical_coverage: {
          risk_profile_approach_question: 'bespoke',
          specific_conditions:
            createMockFirm().medical_coverage.specific_conditions,
        },
        service_details: {
          supplies_documentation_when_needed_question: true,
        },
      },
    });

    const result = await completeConfirmRegistration(firm, confirmNow);

    expect(result).toEqual({ success: true });
    expect(mockedUpdateFirm).toHaveBeenCalledWith(
      'firm-renew-ci',
      expect.objectContaining({
        renewal_draft: null,
        reregister_approved_at: confirmNow.toISOString(),
      }),
    );
    expect(mockedUpdateFirm.mock.calls[0][1]).not.toHaveProperty(
      'reregistered_at',
    );

    process.env.CI = previousCi;
  });

  it('sets approved_at on first successful registration', async () => {
    const firm = createMockFirm({
      id: 'firm-1',
      approved_at: null,
      reregistered_at: null,
      reregister_approved_at: null,
    });

    const result = await completeConfirmRegistration(firm);

    expect(result).toEqual({ success: true });
    expect(mockedUpdateFirm).toHaveBeenCalledWith(
      'firm-1',
      expect.objectContaining({
        approved_at: expect.any(String),
      }),
    );
    expect(mockedUpdateFirm).not.toHaveBeenCalledWith(
      'firm-1',
      expect.objectContaining({
        reregister_approved_at: expect.any(String),
      }),
    );
  });

  it('sets reregister_approved_at on successful re-registration', async () => {
    const firm = createMockFirm({
      id: 'firm-pending',
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
      reRegistrationLogs: {
        reRegWindowStartEmailSentAt: '2025-09-16T00:00:00.000Z',
        lapsedEmailSentAt: '2025-10-16T00:00:00.000Z',
      },
    });

    const result = await completeConfirmRegistration(firm);

    expect(result).toEqual({ success: true });
    expect(mockedUpdateFirm).toHaveBeenCalledWith(
      'firm-pending',
      expect.objectContaining({
        reregister_approved_at: expect.any(String),
        reRegistrationLogs: null,
      }),
    );
    expect(mockedUpdateFirm.mock.calls[0][1]).not.toHaveProperty(
      'reregistered_at',
    );
    expect(mockedUpdateFirm).not.toHaveBeenCalledWith(
      'firm-pending',
      expect.objectContaining({
        approved_at: expect.any(String),
      }),
    );
  });

  it('promotes renewal_draft with confirm-time approval and keeps trigger', async () => {
    const approvedAt = '2025-01-15T12:00:00.000Z';
    const confirmNow = addMonths(new Date(approvedAt), 11);
    confirmNow.setDate(confirmNow.getDate() + 5);

    const firm = createMockFirm({
      id: 'firm-renew',
      status: 'active',
      approved_at: approvedAt,
      reregistered_at: confirmNow.toISOString(),
      reregister_approved_at: null,
      reRegistrationLogs: {
        reRegWindowStartEmailSentAt: '2025-12-15T00:00:00.000Z',
      },
      renewal_draft: {
        covered_by_ombudsman_question: 'true',
        medical_coverage: {
          risk_profile_approach_question: 'bespoke',
          specific_conditions:
            createMockFirm().medical_coverage.specific_conditions,
        },
        service_details: {
          supplies_documentation_when_needed_question: true,
        },
      },
      renewal_resume_href: '/register/scenario/step10',
    });

    const result = await completeConfirmRegistration(firm, confirmNow);

    expect(result).toEqual({ success: true });
    const mainPatch = mockedUpdateFirm.mock.calls[0][1];
    expect(mainPatch.status).toBeUndefined();
    expect(mainPatch.renewal_draft).toBeNull();
    expect(mainPatch.renewal_resume_href).toBeNull();
    expect(mainPatch.reregister_approved_at).toBe(confirmNow.toISOString());
    expect(mainPatch.reRegistrationLogs).toBeNull();
    expect(mainPatch).not.toHaveProperty('reregistered_at');
    expect(mainPatch.pending_add_to_directory).toBe(true);
    expect(mainPatch.pending_add_to_directory_until).toEqual(
      expect.any(String),
    );
    expect(mainPatch.covered_by_ombudsman_question).toBe('true');
    expect(mainPatch['medical_coverage/risk_profile_approach_question']).toBe(
      'bespoke',
    );
    expect(mockedUpdateFirm).toHaveBeenCalledTimes(1);
  });

  it('promotes admin draft outside the window and keeps trigger', async () => {
    const approvedAt = '2024-06-01T12:00:00.000Z';
    const confirmNow = new Date('2024-08-01T00:00:00.000Z');
    const firm = createMockFirm({
      id: 'firm-admin-renew',
      status: 'active',
      approved_at: approvedAt,
      reregistered_at: confirmNow.toISOString(),
      reregister_approved_at: null,
      renewal_draft: {
        covered_by_ombudsman_question: 'true',
        medical_coverage: {
          risk_profile_approach_question: 'questionaire',
          specific_conditions:
            createMockFirm().medical_coverage.specific_conditions,
        },
        service_details: {
          supplies_documentation_when_needed_question: true,
        },
      },
    });

    await completeConfirmRegistration(firm, confirmNow);

    const mainPatch = mockedUpdateFirm.mock.calls[0][1];
    expect(mainPatch.status).toBeUndefined();
    expect(mainPatch.reregister_approved_at).toBe(confirmNow.toISOString());
    expect(mainPatch.reRegistrationLogs).toBeNull();
    expect(mainPatch).not.toHaveProperty('reregistered_at');
    expect(mainPatch.renewal_draft).toBeNull();
  });

  it('stays hidden when renew completes after reregistration lapse hide', async () => {
    const tradingFirm = createMockTradingFirm({
      id: 'trading-lapsed',
      main_firm_id: 'firm-lapsed-renew',
      status: 'hidden',
      hidden_reason: 'reregistration_required',
    });
    mockedFetchTradingDocsByMainFirmId.mockResolvedValueOnce({
      success: true,
      response: [tradingFirm],
    });

    const firm = createEligibleAdminFirm({
      id: 'firm-lapsed-renew',
      status: 'hidden',
      hidden_reason: 'reregistration_required',
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: '2025-10-16T09:21:00Z',
      reregister_approved_at: null,
      reRegistrationLogs: {
        reRegWindowStartEmailSentAt: '2025-09-16T00:00:00.000Z',
        lapsedEmailSentAt: '2025-10-16T00:00:00.000Z',
      },
      renewal_draft: {
        covered_by_ombudsman_question: 'true',
        medical_coverage: {
          risk_profile_approach_question: 'bespoke',
          specific_conditions:
            createMockFirm().medical_coverage.specific_conditions,
        },
        service_details: {
          supplies_documentation_when_needed_question: true,
        },
      },
    });

    await completeConfirmRegistration(firm);

    const mainPatch = mockedUpdateFirm.mock.calls[0][1];
    expect(mainPatch.status).toBeUndefined();
    expect(mainPatch.hidden_reason).toBeUndefined();
    expect(mainPatch.pending_add_to_directory).toBe(true);
    expect(mainPatch.pending_add_to_directory_until).toBeNull();
    expect(mainPatch.reRegistrationLogs).toBeNull();
    expect(mainPatch.reregister_approved_at).toEqual(expect.any(String));
    expect(mockedUpdateFirm).toHaveBeenCalledTimes(1);
  });

  it('does not overwrite approved_at on re-registration', async () => {
    const firm = createMockFirm({
      id: 'firm-pending',
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
    });

    await completeConfirmRegistration(firm);

    const mainPatch = mockedUpdateFirm.mock.calls[0][1];
    expect(mainPatch).not.toHaveProperty('approved_at');
  });

  it('sets pending_approval when self-serve sections are complete', async () => {
    const firm = createEligibleAdminFirm({
      id: 'firm-complete',
      approved_at: null,
      status: 'hidden',
    });

    await completeConfirmRegistration(firm);

    expect(mockedUpdateFirm).toHaveBeenCalledWith(
      'firm-complete',
      expect.objectContaining({
        status: 'pending_approval',
        hidden_at: null,
      }),
    );
  });

  it('updates trading firms directory status', async () => {
    const tradingFirm = createMockTradingFirm({
      id: 'trading-1',
      main_firm_id: 'firm-1',
    });
    mockedFetchTradingDocsByMainFirmId.mockResolvedValueOnce({
      success: true,
      response: [tradingFirm],
    });

    const firm = createMockFirm({
      id: 'firm-1',
      approved_at: null,
    });

    await completeConfirmRegistration(firm);

    expect(mockedUpdateFirm).toHaveBeenCalledWith(
      'trading-1',
      expect.objectContaining({ status: expect.any(String) }),
    );
  });

  it('returns failure when main firm update fails', async () => {
    mockedUpdateFirm.mockResolvedValueOnce({ success: false });

    const result = await completeConfirmRegistration(
      createMockFirm({ id: 'firm-1', approved_at: null }),
    );

    expect(result).toEqual({ success: false, error: 'update_failed' });
  });
});
