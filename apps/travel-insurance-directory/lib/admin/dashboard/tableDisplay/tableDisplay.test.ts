import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';

import {
  buildMainApprovedAtByFcaNumber,
  buildMainReregistrationByFcaNumber,
} from 'lib/admin/shared/firmInheritance/firmInheritance';
import {
  ADMIN_NOT_APPROVED_LABEL,
  ADMIN_NOT_REREGISTERED_LABEL,
  formatAdminAddedAt,
  formatAdminApprovedAt,
  formatAdminReregisterApprovedAt,
  formatAdminReregisteredAt,
} from './tableDisplay';

describe('tableDisplay', () => {
  describe('formatAdminAddedAt', () => {
    it('formats created_at', () => {
      const firm = createMockFirm({ created_at: '2024-10-16T09:21:00Z' });
      expect(formatAdminAddedAt(firm)).toBe('16 Oct 09:21');
    });
  });

  describe('formatAdminApprovedAt', () => {
    it('formats approved_at when set', () => {
      const firm = createMockFirm({ approved_at: '2024-10-16T09:21:00Z' });
      const map = buildMainApprovedAtByFcaNumber([firm]);
      expect(formatAdminApprovedAt(firm, map)).toBe('16 Oct 09:21');
    });

    it('returns Not approved when approved_at is null', () => {
      const firm = createMockFirm({ approved_at: null });
      const map = buildMainApprovedAtByFcaNumber([firm]);
      expect(formatAdminApprovedAt(firm, map)).toBe(ADMIN_NOT_APPROVED_LABEL);
    });

    it('inherits approved_at from main for trading documents', () => {
      const main = createMockFirm({
        fca_number: 610022,
        approved_at: '2024-10-16T09:21:00Z',
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 610022,
        main_firm_id: main.id,
        approved_at: null,
      });
      const map = buildMainApprovedAtByFcaNumber([main]);
      expect(formatAdminApprovedAt(trading, map)).toBe('16 Oct 09:21');
    });
  });

  describe('formatAdminReregisteredAt', () => {
    it('formats reregistered_at for main firm', () => {
      const firm = createMockFirm({
        reregistered_at: '2024-11-21T10:18:00Z',
      });
      const map = buildMainReregistrationByFcaNumber([firm]);
      expect(formatAdminReregisteredAt(firm, map)).toBe('21 Nov 10:18');
    });

    it('returns Not reregistered when reregistered_at is null', () => {
      const firm = createMockFirm({ reregistered_at: null });
      const map = buildMainReregistrationByFcaNumber([firm]);
      expect(formatAdminReregisteredAt(firm, map)).toBe(
        ADMIN_NOT_REREGISTERED_LABEL,
      );
    });

    it('inherits reregistered_at from main for trading documents', () => {
      const main = createMockFirm({
        fca_number: 610022,
        reregistered_at: '2024-11-21T10:18:00Z',
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 610022,
        main_firm_id: main.id,
      });
      const map = buildMainReregistrationByFcaNumber([main]);
      expect(formatAdminReregisteredAt(trading, map)).toBe('21 Nov 10:18');
    });
  });

  describe('formatAdminReregisterApprovedAt', () => {
    it('formats reregister_approved_at for main firm', () => {
      const firm = createMockFirm({
        reregister_approved_at: '2024-12-24T11:19:00Z',
      });
      const map = buildMainReregistrationByFcaNumber([firm]);
      expect(formatAdminReregisterApprovedAt(firm, map)).toBe('24 Dec 11:19');
    });

    it('returns Not approved when reregister_approved_at is null', () => {
      const firm = createMockFirm({ reregister_approved_at: null });
      const map = buildMainReregistrationByFcaNumber([firm]);
      expect(formatAdminReregisterApprovedAt(firm, map)).toBe(
        ADMIN_NOT_APPROVED_LABEL,
      );
    });

    it('inherits reregister_approved_at from main for trading documents', () => {
      const main = createMockFirm({
        fca_number: 610022,
        reregister_approved_at: '2024-12-24T11:19:00Z',
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 610022,
        main_firm_id: main.id,
      });
      const map = buildMainReregistrationByFcaNumber([main]);
      expect(formatAdminReregisterApprovedAt(trading, map)).toBe(
        '24 Dec 11:19',
      );
    });
  });
});
