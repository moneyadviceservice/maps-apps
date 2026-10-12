import { addMonths } from 'date-fns';
import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { buildRenewalDraftFromFirm } from 'lib/register/registerFieldPaths';

import { ensureRenewalDraftForRegisterFlow } from './ensureRenewalDraftForRegisterFlow';

const mockedUpdateFirm = jest.fn();
jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: (...args: unknown[]) => mockedUpdateFirm(...args),
}));

const mockedGetFirmById = jest.fn();
jest.mock('lib/firms/fetchFirm', () => ({
  getFirmById: (...args: unknown[]) => mockedGetFirmById(...args),
}));

describe('ensureRenewalDraftForRegisterFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUpdateFirm.mockResolvedValue({ success: true });
  });

  it('does nothing outside the renewal window', async () => {
    const firm = createMockFirm({
      approved_at: '2025-01-15T12:00:00.000Z',
      renewal_draft: null,
    });

    const result = await ensureRenewalDraftForRegisterFlow(
      firm,
      { db_id: firm.id },
      new Date('2025-02-01T00:00:00.000Z'),
    );

    expect(result).toBe(firm);
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
  });

  it('starts a draft when landing on register URLs inside the window', async () => {
    const approvedAt = '2025-01-15T12:00:00.000Z';
    const firm = createMockFirm({
      id: 'firm-1',
      approved_at: approvedAt,
      renewal_draft: null,
    });
    const now = addMonths(new Date(approvedAt), 11);
    now.setDate(now.getDate() + 2);

    const refreshed = createMockFirm({
      id: 'firm-1',
      approved_at: approvedAt,
      renewal_draft: buildRenewalDraftFromFirm(firm),
      renewal_resume_href: '/register/firm/step1',
    });
    mockedGetFirmById.mockResolvedValue({
      success: true,
      response: refreshed,
    });

    const result = await ensureRenewalDraftForRegisterFlow(
      firm,
      { db_id: firm.id },
      now,
    );

    expect(mockedUpdateFirm).toHaveBeenCalled();
    expect(result.renewal_draft).not.toBeNull();
  });
});
