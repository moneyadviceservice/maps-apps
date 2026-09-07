import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import type { Principal } from 'types/travel-insurance-firm';

import {
  buildMainApprovedAtByFcaNumber,
  buildMainPrincipalByFcaNumber,
  buildMainRegisteredNameByFcaNumber,
  buildMainReregistrationByFcaNumber,
  formatTradingFirmDisplayName,
  getApprovedAtForAdmin,
  getFirmDisplayNameForAdmin,
  getPrincipalForAdmin,
  getReregisterApprovedAtForAdmin,
  getReregisteredAtForAdmin,
  principalMatchesSearch,
} from './firmInheritance';

const principal = (first: string, last: string): Principal => ({
  first_name: first,
  last_name: last,
  job_title: null,
  email_address: null,
  telephone_number: null,
  confirmed_disclaimer: true,
  senior_manager_name: null,
  individual_reference_number: 'IRN-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
});

describe('firmInheritance', () => {
  describe('buildMainPrincipalByFcaNumber', () => {
    it('maps fca_number to principal from main documents only', () => {
      const main = createMockFirm({
        fca_number: 610022,
        principal: principal('Amy', 'Adams'),
      });
      const trading = createMockTradingFirm({
        id: 'trading-1',
        fca_number: 610022,
        main_firm_id: main.id,
        registered_name: 'Trading Co',
      });

      const map = buildMainPrincipalByFcaNumber([main, trading]);

      expect(map.size).toBe(1);
      expect(map.get(610022)).toEqual(main.principal);
    });

    it('keeps first main principal per fca_number', () => {
      const first = createMockFirm({
        id: 'main-1',
        fca_number: 100,
        principal: principal('First', 'Principal'),
      });
      const second = createMockFirm({
        id: 'main-2',
        fca_number: 100,
        principal: principal('Second', 'Principal'),
      });

      const map = buildMainPrincipalByFcaNumber([first, second]);

      expect(map.get(100)?.first_name).toBe('First');
    });
  });

  describe('buildMainReregistrationByFcaNumber', () => {
    it('maps fca_number to main re-registration dates', () => {
      const main = createMockFirm({
        fca_number: 610022,
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: '2024-12-24T11:19:00Z',
      });
      const map = buildMainReregistrationByFcaNumber([main]);

      expect(map.get(610022)).toEqual({
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: '2024-12-24T11:19:00Z',
      });
    });
  });

  describe('getReregisteredAtForAdmin', () => {
    it('inherits reregistered_at from main for trading documents', () => {
      const main = createMockFirm({
        fca_number: 610022,
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 610022,
        main_firm_id: main.id,
      });
      const map = buildMainReregistrationByFcaNumber([main]);

      expect(getReregisteredAtForAdmin(trading, map)).toBe(
        '2024-11-21T10:18:00Z',
      );
    });

    it('returns null for trading when map has no entry', () => {
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 888,
      });

      expect(
        getReregisteredAtForAdmin(
          trading,
          buildMainReregistrationByFcaNumber([]),
        ),
      ).toBeNull();
    });
  });

  describe('getReregisterApprovedAtForAdmin', () => {
    it('inherits reregister_approved_at from main for trading documents', () => {
      const main = createMockFirm({
        fca_number: 610022,
        reregistered_at: null,
        reregister_approved_at: '2024-12-24T11:19:00Z',
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 610022,
        main_firm_id: main.id,
      });
      const map = buildMainReregistrationByFcaNumber([main]);

      expect(getReregisterApprovedAtForAdmin(trading, map)).toBe(
        '2024-12-24T11:19:00Z',
      );
    });
  });

  describe('getApprovedAtForAdmin', () => {
    it('inherits approved_at from main for trading documents', () => {
      const main = createMockFirm({
        fca_number: 610022,
        approved_at: '2024-10-16T09:21:00Z',
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 610022,
        main_firm_id: main.id,
      });
      const map = buildMainApprovedAtByFcaNumber([main]);

      expect(getApprovedAtForAdmin(trading, map)).toBe('2024-10-16T09:21:00Z');
    });

    it('returns null for trading when map has no entry', () => {
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 888,
      });

      expect(
        getApprovedAtForAdmin(trading, buildMainApprovedAtByFcaNumber([])),
      ).toBeNull();
    });
  });

  describe('getPrincipalForAdmin', () => {
    it('returns firm principal for main documents', () => {
      const main = createMockFirm({ principal: principal('Main', 'Person') });
      const map = buildMainPrincipalByFcaNumber([main]);

      expect(getPrincipalForAdmin(main, map)).toEqual(main.principal);
    });

    it('inherits principal from map for trading documents', () => {
      const main = createMockFirm({
        fca_number: 999,
        principal: principal('Inherited', 'Name'),
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 999,
        main_firm_id: main.id,
        registered_name: 'Brand',
      });
      const map = buildMainPrincipalByFcaNumber([main]);

      expect(getPrincipalForAdmin(trading, map)).toEqual(main.principal);
    });

    it('returns null for trading when map has no entry', () => {
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 888,
      });
      const map = buildMainPrincipalByFcaNumber([]);

      expect(getPrincipalForAdmin(trading, map)).toBeNull();
    });
  });

  describe('buildMainRegisteredNameByFcaNumber', () => {
    it('maps fca_number to main registered_name', () => {
      const main = createMockFirm({
        fca_number: 610022,
        registered_name: 'Main Firm Ltd',
      });
      const map = buildMainRegisteredNameByFcaNumber([main]);

      expect(map.get(610022)).toBe('Main Firm Ltd');
    });
  });

  describe('formatTradingFirmDisplayName', () => {
    it('formats as trading name subsidiary of main firm', () => {
      expect(formatTradingFirmDisplayName('Trading Co', 'Main Firm Ltd')).toBe(
        'Trading Co subsidiary of Main Firm Ltd',
      );
    });

    it('returns trading name only when main name is missing', () => {
      expect(formatTradingFirmDisplayName('Trading Co', null)).toBe(
        'Trading Co',
      );
    });
  });

  describe('getFirmDisplayNameForAdmin', () => {
    it('returns main registered_name for main documents', () => {
      const main = createMockFirm({ registered_name: 'Main Firm Ltd' });
      expect(getFirmDisplayNameForAdmin(main, new Map())).toBe('Main Firm Ltd');
    });

    it('returns subsidiary label for trading documents', () => {
      const main = createMockFirm({
        fca_number: 610022,
        registered_name: 'Main Firm Ltd',
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 610022,
        main_firm_id: main.id,
        registered_name: 'Trading Co',
      });
      const map = buildMainRegisteredNameByFcaNumber([main]);

      expect(getFirmDisplayNameForAdmin(trading, map)).toBe(
        'Trading Co subsidiary of Main Firm Ltd',
      );
    });
  });

  describe('principalMatchesSearch', () => {
    it('matches any token against first or last name (OR)', () => {
      const p = principal('John', 'Smith');
      expect(principalMatchesSearch(p, ['john'])).toBe(true);
      expect(principalMatchesSearch(p, ['smith'])).toBe(true);
      expect(principalMatchesSearch(p, ['smith', 'other'])).toBe(true);
    });

    it('returns false for null principal or empty tokens', () => {
      expect(principalMatchesSearch(null, ['john'])).toBe(false);
      expect(principalMatchesSearch(principal('A', 'B'), [])).toBe(false);
    });
  });
});
