import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import type { Principal } from 'types/travel-insurance-firm';

import {
  buildMainApprovedAtByFirmId,
  buildMainPrincipalByFirmId,
  buildMainRegisteredNameByFirmId,
  buildMainReregistrationByFirmId,
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
  describe('buildMainPrincipalByFirmId', () => {
    it('maps main firm id to principal from main documents only', () => {
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

      const map = buildMainPrincipalByFirmId([main, trading]);

      expect(map.size).toBe(1);
      expect(map.get(main.id)).toEqual(main.principal);
    });

    it('keeps each main principal when firms share an FCA number', () => {
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

      const map = buildMainPrincipalByFirmId([first, second]);

      expect(map.get('main-1')?.first_name).toBe('First');
      expect(map.get('main-2')?.first_name).toBe('Second');
    });
  });

  describe('buildMainReregistrationByFirmId', () => {
    it('maps main firm id to re-registration dates', () => {
      const main = createMockFirm({
        fca_number: 610022,
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: '2024-12-24T11:19:00Z',
      });
      const map = buildMainReregistrationByFirmId([main]);

      expect(map.get(main.id)).toEqual({
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
      const map = buildMainReregistrationByFirmId([main]);

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
        getReregisteredAtForAdmin(trading, buildMainReregistrationByFirmId([])),
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
      const map = buildMainReregistrationByFirmId([main]);

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
      const map = buildMainApprovedAtByFirmId([main]);

      expect(getApprovedAtForAdmin(trading, map)).toBe('2024-10-16T09:21:00Z');
    });

    it('returns null for trading when map has no entry', () => {
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 888,
      });

      expect(
        getApprovedAtForAdmin(trading, buildMainApprovedAtByFirmId([])),
      ).toBeNull();
    });
  });

  describe('getPrincipalForAdmin', () => {
    it('returns firm principal for main documents', () => {
      const main = createMockFirm({ principal: principal('Main', 'Person') });
      const map = buildMainPrincipalByFirmId([main]);

      expect(getPrincipalForAdmin(main, map)).toEqual(main.principal);
    });

    it('inherits the principal of the referenced main when another main shares the FCA', () => {
      const linked = createMockFirm({
        id: 'linked-main',
        fca_number: 610022,
        principal: {
          ...principal('Amy', 'Adams'),
          email_address: 'amy.adams@example.com',
        },
      });
      const other = createMockFirm({
        id: 'other-main',
        fca_number: 610022,
        principal: {
          ...principal('Other', 'Person'),
          email_address: 'other@example.com',
        },
      });
      const trading = createMockTradingFirm({
        id: 't-shared-fca',
        fca_number: 610022,
        main_firm_id: linked.id,
        registered_name: 'Brand',
      });
      const map = buildMainPrincipalByFirmId([other, linked]);

      expect(getPrincipalForAdmin(trading, map)?.email_address).toBe(
        'amy.adams@example.com',
      );
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
      const map = buildMainPrincipalByFirmId([main]);

      expect(getPrincipalForAdmin(trading, map)).toEqual(main.principal);
    });

    it('returns null for trading when map has no entry', () => {
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 888,
      });
      const map = buildMainPrincipalByFirmId([]);

      expect(getPrincipalForAdmin(trading, map)).toBeNull();
    });
  });

  describe('buildMainRegisteredNameByFirmId', () => {
    it('maps main firm id to registered_name', () => {
      const main = createMockFirm({
        fca_number: 610022,
        registered_name: 'Main Firm Ltd',
      });
      const map = buildMainRegisteredNameByFirmId([main]);

      expect(map.get(main.id)).toBe('Main Firm Ltd');
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
      const map = buildMainRegisteredNameByFirmId([main]);

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
      expect(
        principalMatchesSearch(
          {
            ...principal('Amy', 'Adams'),
            email_address: 'amy.adams@example.com',
          },
          ['amy.adams@example.com'],
        ),
      ).toBe(true);
    });
  });
});
