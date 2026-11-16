import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import { HIDDEN_DUE_TO_FCA } from 'lib/firms/fcaVisibility';
import { tidReregistration } from 'lib/notify/tid-reregistration';
import { buildRenewalDraftFromFirm } from 'lib/register/registerFieldPaths';

import { applyFirmReregistration } from './reregistration';

const mockedUpdateFirm = jest.fn();
jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: (...args: unknown[]) => mockedUpdateFirm(...args),
}));

const mockedInvalidateFirmsListingCache = jest.fn();
jest.mock('lib/firms/invalidateFirmsListingCache', () => ({
  invalidateFirmsListingCache: () => mockedInvalidateFirmsListingCache(),
}));

jest.mock('lib/notify/tid-reregistration', () => ({
  tidReregistration: jest.fn(),
}));

const mockedTidReregistration = tidReregistration as jest.MockedFunction<
  typeof tidReregistration
>;

describe('applyFirmReregistration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUpdateFirm.mockResolvedValue({ success: true });
    mockedTidReregistration.mockResolvedValue('success');
  });

  it('returns not_main_firm for trading documents', async () => {
    const trading = createMockTradingFirm({ id: 'trading-1' });

    const result = await applyFirmReregistration(trading);

    expect(result).toEqual({ success: false, error: 'not_main_firm' });
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
  });

  it('returns not_eligible when re-registration is in progress', async () => {
    const firm = createMockFirm({
      id: 'main-1',
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
      renewal_draft: buildRenewalDraftFromFirm(createMockFirm()),
    });

    const result = await applyFirmReregistration(firm);

    expect(result).toEqual({ success: false, error: 'not_eligible' });
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
  });

  it('returns not_eligible when firm has an FCA visibility block', async () => {
    const firm = createMockFirm({
      id: 'main-1',
      approved_at: '2024-10-16T09:21:00Z',
      status: 'hidden',
      hidden_reason: HIDDEN_DUE_TO_FCA,
    });

    const result = await applyFirmReregistration(firm);

    expect(result).toEqual({ success: false, error: 'not_eligible' });
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
  });

  it('starts the renewal_draft and hides the firm from the directory', async () => {
    const firm = createMockFirm({
      id: 'main-1',
      status: 'active',
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: null,
      reregister_approved_at: null,
      renewal_draft: null,
    });

    const result = await applyFirmReregistration(firm);

    expect(result).toEqual({ success: true });
    expect(mockedUpdateFirm).toHaveBeenNthCalledWith(
      1,
      'main-1',
      expect.objectContaining({
        reregistered_at: expect.any(String),
        renewal_resume_href: '/register/firm/step1',
        renewal_draft: expect.objectContaining({
          covered_by_ombudsman_question: firm.covered_by_ombudsman_question,
        }),
      }),
    );
    const draftPatch = mockedUpdateFirm.mock.calls[0][1];
    expect(draftPatch.status).toBeUndefined();
    expect(draftPatch.reregister_approved_at).toBeUndefined();
    expect(mockedUpdateFirm).toHaveBeenNthCalledWith(2, 'main-1', {
      status: 'hidden',
      hidden_at: expect.any(String),
      hidden_reason: 'reregistration_required',
    });
    expect(mockedInvalidateFirmsListingCache).toHaveBeenCalledTimes(1);
    expect(mockedTidReregistration).toHaveBeenCalledWith(
      'Jane',
      'jane@example.com',
    );
  });

  it('keeps a previously hidden firm hidden when admin re-registers', async () => {
    const firm = createMockFirm({
      id: 'main-1',
      status: 'hidden',
      hidden_at: '2025-01-15T00:00:00Z',
      hidden_reason: 'reregistration_required',
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: null,
      reregister_approved_at: '2024-12-20T10:00:00Z',
      renewal_draft: null,
    });

    const result = await applyFirmReregistration(firm);

    expect(result).toEqual({ success: true });
    expect(mockedUpdateFirm).toHaveBeenNthCalledWith(2, 'main-1', {
      status: 'hidden',
      hidden_at: expect.any(String),
      hidden_reason: 'reregistration_required',
    });
    expect(mockedInvalidateFirmsListingCache).toHaveBeenCalledTimes(1);
  });

  it('still succeeds when the principal email send fails', async () => {
    mockedTidReregistration.mockResolvedValueOnce(
      new Error('re-registration email not sent'),
    );
    const firm = createMockFirm({
      id: 'main-1',
      approved_at: '2024-10-16T09:21:00Z',
    });

    const result = await applyFirmReregistration(firm);

    expect(result).toEqual({ success: true });
    expect(mockedTidReregistration).toHaveBeenCalled();
  });

  it('skips the email when principal contact details are missing', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const firm = createMockFirm({
      id: 'main-1',
      approved_at: '2024-10-16T09:21:00Z',
      principal: {
        ...createMockFirm().principal,
        first_name: null,
        email_address: null,
      },
    });

    const result = await applyFirmReregistration(firm);

    expect(result).toEqual({ success: true });
    expect(mockedTidReregistration).not.toHaveBeenCalled();
  });

  it('restarts after completed re-registration with a fresh draft and trigger', async () => {
    const firm = createMockFirm({
      id: 'main-1',
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: '2024-12-20T10:00:00Z',
      renewal_draft: null,
    });

    const result = await applyFirmReregistration(firm);

    expect(result).toEqual({ success: true });
    expect(mockedUpdateFirm).toHaveBeenNthCalledWith(
      1,
      'main-1',
      expect.objectContaining({
        renewal_draft: expect.any(Object),
        renewal_resume_href: '/register/firm/step1',
        reregistered_at: expect.any(String),
      }),
    );
    expect(mockedUpdateFirm).toHaveBeenNthCalledWith(2, 'main-1', {
      status: 'hidden',
      hidden_at: expect.any(String),
      hidden_reason: 'reregistration_required',
    });
  });

  it('returns update_failed when draft start fails', async () => {
    mockedUpdateFirm.mockResolvedValueOnce({ success: false });
    const firm = createMockFirm({
      id: 'main-1',
      approved_at: '2024-10-16T09:21:00Z',
    });

    const result = await applyFirmReregistration(firm);

    expect(result).toEqual({ success: false, error: 'update_failed' });
    expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
  });

  it('returns update_failed when applying hidden status fails', async () => {
    mockedUpdateFirm
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false });
    const firm = createMockFirm({
      id: 'main-1',
      approved_at: '2024-10-16T09:21:00Z',
    });

    const result = await applyFirmReregistration(firm);

    expect(result).toEqual({ success: false, error: 'update_failed' });
    expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
    expect(mockedTidReregistration).not.toHaveBeenCalled();
  });
});
