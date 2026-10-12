import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { buildRenewalDraftFromFirm } from 'lib/register/registerFieldPaths';

import { startReregistrationDraft } from './startReregistrationDraft';

const mockedUpdateFirm = jest.fn();
jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: (...args: unknown[]) => mockedUpdateFirm(...args),
}));

describe('startReregistrationDraft', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUpdateFirm.mockResolvedValue({ success: true });
  });

  it('creates renewal_draft without changing status', async () => {
    const firm = createMockFirm({
      id: 'firm-1',
      status: 'active',
      renewal_draft: null,
    });

    const now = new Date('2025-12-01T00:00:00.000Z');
    const result = await startReregistrationDraft(firm, now);

    expect(result).toEqual({
      success: true,
      resumeHref: '/register/firm/step1',
    });
    expect(mockedUpdateFirm).toHaveBeenCalledWith(
      'firm-1',
      expect.objectContaining({
        reregistered_at: now.toISOString(),
        renewal_draft: expect.objectContaining({
          covered_by_ombudsman_question: firm.covered_by_ombudsman_question,
        }),
        renewal_resume_href: '/register/firm/step1',
      }),
    );
    expect(mockedUpdateFirm.mock.calls[0][1].status).toBeUndefined();
  });

  it('is idempotent when draft already exists', async () => {
    const firm = createMockFirm({
      renewal_draft: buildRenewalDraftFromFirm(createMockFirm()),
      renewal_resume_href: '/register/firm/step2',
      reregistered_at: '2025-12-01T00:00:00.000Z',
    });

    const result = await startReregistrationDraft(firm);

    expect(result).toEqual({
      success: true,
      resumeHref: '/register/firm/step2',
    });
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
  });

  it('sets a fresh reregistered_at trigger when starting another renew cycle', async () => {
    const firm = createMockFirm({
      id: 'firm-2',
      // Previous cycle's kept trigger (older than approval).
      reregistered_at: '2025-11-01T00:00:00.000Z',
      reregister_approved_at: '2025-12-20T00:00:00.000Z',
      renewal_draft: null,
    });

    const now = new Date('2026-12-01T00:00:00.000Z');
    await startReregistrationDraft(firm, now);

    const patch = mockedUpdateFirm.mock.calls[0][1];
    expect(patch.reregistered_at).toBe(now.toISOString());
    expect(patch.renewal_draft).toBeDefined();
  });

  it('keeps an existing active admin/cron reregistered_at when creating the draft', async () => {
    const existingTrigger = '2025-12-15T00:00:00.000Z';
    const firm = createMockFirm({
      id: 'firm-3',
      reregistered_at: existingTrigger,
      reregister_approved_at: null,
      renewal_draft: null,
    });

    await startReregistrationDraft(firm, new Date('2025-12-20T00:00:00.000Z'));

    const patch = mockedUpdateFirm.mock.calls[0][1];
    expect(patch.reregistered_at).toBeUndefined();
    expect(patch.renewal_draft).toBeDefined();
  });
});
