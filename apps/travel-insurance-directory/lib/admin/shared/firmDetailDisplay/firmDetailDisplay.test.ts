import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import type { Office, Principal } from 'types/travel-insurance-firm';

import {
  formatPrincipalName,
  getPrincipalForAdminDetail,
  getWebsiteAddressForAdmin,
} from './firmDetailDisplay';

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

describe('firmDetailDisplay', () => {
  describe('getWebsiteAddressForAdmin', () => {
    it('prefers office contact website over website_address', () => {
      const main = createMockFirm({
        website_address: 'https://top-level.example',
        office: {
          ...createMockFirm().office,
          contact: {
            ...createMockFirm().office?.contact,
            website: 'https://contact.example',
          },
        } as Office,
      });

      expect(getWebsiteAddressForAdmin(main, null)).toBe(
        'https://contact.example',
      );
    });

    it('inherits main contact website for trading when trading has no office', () => {
      const main = createMockFirm({
        fca_number: 610022,
        website_address: 'https://main.example',
        office: {
          ...createMockFirm().office,
          contact: {
            ...createMockFirm().office?.contact,
            website: 'https://main-contact.example',
          },
        } as Office,
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 610022,
        main_firm_id: main.id,
        website_address: null,
        office: null,
      });

      expect(getWebsiteAddressForAdmin(trading, main)).toBe(
        'https://main-contact.example',
      );
    });
  });

  describe('getPrincipalForAdminDetail', () => {
    it('inherits principal from mainFirm for trading documents', () => {
      const main = createMockFirm({
        fca_number: 610022,
        principal: principal('Amy', 'Adams'),
      });
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 610022,
        main_firm_id: main.id,
      });

      expect(getPrincipalForAdminDetail(trading, main)).toEqual(main.principal);
    });

    it('returns null for trading when mainFirm is missing', () => {
      const trading = createMockTradingFirm({
        id: 't1',
        fca_number: 888,
      });

      expect(getPrincipalForAdminDetail(trading, null)).toBeNull();
    });
  });

  describe('formatPrincipalName', () => {
    it('formats first and last name', () => {
      expect(formatPrincipalName(principal('Jane', 'Doe'))).toBe('Jane Doe');
    });

    it('returns em dash when principal is null', () => {
      expect(formatPrincipalName(null)).toBe('—');
    });
  });
});
