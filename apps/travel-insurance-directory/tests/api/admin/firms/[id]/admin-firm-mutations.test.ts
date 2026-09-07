import type { NextApiHandler, NextApiRequest } from 'next';

import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { createEligibleAdminFirm } from 'lib/admin/shared/testing/adminFirmFixtures';

import { createMockRes } from 'tests/api/account-auth/testUtils';

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: jest.fn(),
}));

jest.mock(
  'lib/admin/shared/fetchMainFirmByFcaNumber/fetchMainFirmByFcaNumber',
  () => ({
    fetchMainFirmByFcaNumber: jest.fn(),
  }),
);

const mockedLoadAdminFirmById = jest.fn();
jest.mock('lib/admin/shared/loadAdminFirmById/loadAdminFirmById', () => ({
  loadAdminFirmById: (...args: unknown[]) => mockedLoadAdminFirmById(...args),
}));

jest.mock('lib/admin/detail/api/adminFirmRequest/adminFirmRequest', () => ({
  ensurePostMethodAndAdminSession: (
    req: NextApiRequest & { session: { isAdmin?: boolean } },
    res: {
      status: (code: number) => typeof res;
      setHeader: jest.Mock;
      end: jest.Mock;
      json: jest.Mock;
    },
  ) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).end();
      return false;
    }
    if (!req.session?.isAdmin) {
      res.status(401).json({ error: 'Unauthorized' });
      return false;
    }
    return true;
  },
  getFirmIdFromAdminRequest: (req: NextApiRequest) => {
    const raw = req.query?.id;
    if (typeof raw === 'string') {
      return raw.trim();
    }
    if (Array.isArray(raw) && raw[0]) {
      return String(raw[0]).trim();
    }
    return '';
  },
  redirectToAdminFirmDetail: (
    res: { redirect: (code: number, url: string) => void },
    firmId: string,
  ) => {
    res.redirect(302, `/admin/firms/${firmId}`);
  },
  withAdminFirmApiSession: (fn: NextApiHandler) => fn,
}));

const mockedUpdateFirm = jest.fn();
jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: (...args: unknown[]) => mockedUpdateFirm(...args),
}));

const mockedInvalidateFirmsListingCache = jest.fn();
jest.mock('lib/firms/invalidateFirmsListingCache', () => ({
  invalidateFirmsListingCache: () => mockedInvalidateFirmsListingCache(),
}));

const mockedFetchTradingDocsByMainFirmId = jest.fn();
jest.mock('lib/account/tradingFirm', () => ({
  fetchTradingDocsByMainFirmId: (...args: unknown[]) =>
    mockedFetchTradingDocsByMainFirmId(...args),
}));

jest.mock('lib/notify/tid-reregistration', () => ({
  tidReregistration: jest.fn().mockResolvedValue('success'),
}));

import directoryStatusHandler from 'pages/api/admin/firms/[id]/directory-status';
import reregisterHandler from 'pages/api/admin/firms/[id]/reregister';

type MockReq = NextApiRequest & {
  session: { isAdmin?: boolean };
  query: { id?: string; action?: string };
};

function createAdminReq(
  method: string,
  firmId: string,
  session?: Record<string, unknown>,
  action?: string,
): MockReq {
  return {
    method,
    query: { id: firmId, ...(action ? { action } : {}) },
    session: session ?? { isAdmin: true },
  } as unknown as MockReq;
}

describe('admin firm directory mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUpdateFirm.mockResolvedValue({ success: true });
    mockedInvalidateFirmsListingCache.mockResolvedValue(undefined);
    mockedFetchTradingDocsByMainFirmId.mockResolvedValue({
      success: true,
      response: [],
    });
  });

  it('returns 400 when action is missing or invalid', async () => {
    mockedLoadAdminFirmById.mockResolvedValueOnce({
      firm: createEligibleAdminFirm({ id: 'firm-approve-1', status: 'hidden' }),
      mainFirm: null,
    });

    const req = createAdminReq('POST', 'firm-approve-1');
    const res = createMockRes();

    await directoryStatusHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid action' });
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
    expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
  });

  describe.each([
    {
      label: 'approve',
      action: 'approve',
      expectedPatch: expect.objectContaining({
        status: 'active',
        hidden_at: null,
      }),
    },
    {
      label: 'hide',
      action: 'hide',
      expectedPatch: expect.objectContaining({
        status: 'hidden',
        hidden_at: expect.any(String),
      }),
    },
  ])('$label', ({ action, expectedPatch }) => {
    it('redirects to firm detail on success', async () => {
      const firm =
        action === 'hide'
          ? createEligibleAdminFirm({ status: 'active' })
          : createEligibleAdminFirm({ status: 'hidden' });

      mockedLoadAdminFirmById.mockResolvedValueOnce({
        firm,
        mainFirm: null,
      });

      const req = createAdminReq('POST', firm.id, { isAdmin: true }, action);
      const res = createMockRes();

      await directoryStatusHandler(req, res);

      expect(mockedUpdateFirm).toHaveBeenCalledWith(firm.id, expectedPatch);
      expect(mockedInvalidateFirmsListingCache).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(302, `/admin/firms/${firm.id}`);
    });

    it('returns 401 when session is not admin', async () => {
      const req = createAdminReq('POST', 'firm-1', { isAdmin: false }, action);
      const res = createMockRes();

      await directoryStatusHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockedLoadAdminFirmById).not.toHaveBeenCalled();
    });

    it('returns 405 for non-POST requests', async () => {
      const req = createAdminReq('GET', 'firm-1', { isAdmin: true }, action);
      const res = createMockRes();

      await directoryStatusHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
    });

    it('returns 404 when firm is not found', async () => {
      mockedLoadAdminFirmById.mockResolvedValueOnce(null);

      const req = createAdminReq(
        'POST',
        'missing-firm',
        { isAdmin: true },
        action,
      );
      const res = createMockRes();

      await directoryStatusHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns 400 when firm is not eligible', async () => {
      mockedLoadAdminFirmById.mockResolvedValueOnce({
        firm: createMockFirm({ id: 'firm-ineligible', status: 'hidden' }),
        mainFirm: null,
      });

      const req = createAdminReq(
        'POST',
        'firm-ineligible',
        { isAdmin: true },
        action,
      );
      const res = createMockRes();

      await directoryStatusHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockedUpdateFirm).not.toHaveBeenCalled();
      expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
    });

    it('returns 400 when status transition is invalid', async () => {
      const firm =
        action === 'approve'
          ? createEligibleAdminFirm({ status: 'active' })
          : createEligibleAdminFirm({ status: 'hidden' });

      mockedLoadAdminFirmById.mockResolvedValueOnce({
        firm,
        mainFirm: null,
      });

      const req = createAdminReq('POST', firm.id, { isAdmin: true }, action);
      const res = createMockRes();

      await directoryStatusHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockedUpdateFirm).not.toHaveBeenCalled();
      expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
    });
  });

  describe('reregister', () => {
    it('redirects to firm detail on success', async () => {
      const firm = createEligibleAdminFirm({
        id: 'firm-reregister-1',
        status: 'active',
        approved_at: '2024-10-16T09:21:00Z',
      });

      mockedLoadAdminFirmById.mockResolvedValueOnce({
        firm,
        mainFirm: null,
      });

      const req = createAdminReq('POST', firm.id);
      const res = createMockRes();

      await reregisterHandler(req, res);

      expect(mockedUpdateFirm).toHaveBeenNthCalledWith(
        1,
        firm.id,
        expect.objectContaining({
          reregistered_at: expect.any(String),
          renewal_draft: expect.any(Object),
          renewal_resume_href: '/register/firm/step1',
        }),
      );
      expect(mockedUpdateFirm).toHaveBeenNthCalledWith(2, firm.id, {
        status: 'hidden',
        hidden_at: expect.any(String),
        hidden_reason: 'reregistration_required',
      });
      expect(mockedInvalidateFirmsListingCache).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(302, `/admin/firms/${firm.id}`);
    });

    it('returns 400 when firm is not eligible', async () => {
      mockedLoadAdminFirmById.mockResolvedValueOnce({
        firm: createMockFirm({
          id: 'firm-pending-reregister',
          approved_at: '2024-10-16T09:21:00Z',
          reregistered_at: '2024-11-21T10:18:00Z',
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
        }),
        mainFirm: null,
      });

      const req = createAdminReq('POST', 'firm-pending-reregister');
      const res = createMockRes();

      await reregisterHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'not_eligible' });
      expect(mockedUpdateFirm).not.toHaveBeenCalled();
      expect(mockedInvalidateFirmsListingCache).not.toHaveBeenCalled();
    });
  });
});
