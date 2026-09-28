import { NextRouter } from 'next/router';
import pageFilters from './pageFilters';

jest.mock('slug', () => ({
  __esModule: true,
  default: (str: string) => str.toLowerCase().replace(/\s+/g, '-'),
}));

describe('pageFilters', () => {
  const createMockRouter = (
    query: Record<string, string | string[]> = {},
  ): NextRouter =>
    ({
      query,
      push: jest.fn().mockResolvedValue(true),
    } as unknown as NextRouter);

  describe('accountTypes', () => {
    it('should return active account types based on query parameters', () => {
      const router = createMockRouter({
        standardcurrent: 'true',
        feefreebasicbank: 'true',
      });
      const filters = pageFilters(router);

      expect(filters.accountTypes).toEqual([
        'standardCurrent',
        'feeFreeBasicBank',
      ]);
    });

    it('should return empty array when no account types are selected', () => {
      const router = createMockRouter({});
      const filters = pageFilters(router);

      expect(filters.accountTypes).toEqual([]);
    });
  });

  describe('accountFeatures', () => {
    it('should return active account features based on query parameters', () => {
      const router = createMockRouter({
        nomonthlyfee: 'true',
        overdraftfacilities: 'true',
      });
      const filters = pageFilters(router);

      expect(filters.accountFeatures).toEqual([
        'noMonthlyFee',
        'overdraftFacilities',
      ]);
    });
  });

  describe('accountAccess', () => {
    it('should return active account access options based on query parameters', () => {
      const router = createMockRouter({
        branchbanking: 'true',
        mobileappbanking: 'true',
      });
      const filters = pageFilters(router);

      expect(filters.accountAccess).toEqual([
        'branchBanking',
        'mobileAppBanking',
      ]);
    });
  });

  describe('searchQuery', () => {
    it('should return search query from router', () => {
      const router = createMockRouter({ q: 'basic account' });
      const filters = pageFilters(router);

      expect(filters.searchQuery).toBe('basic account');
    });

    it('should return empty string when no search query', () => {
      const router = createMockRouter({});
      const filters = pageFilters(router);

      expect(filters.searchQuery).toBe('');
    });
  });

  describe('page', () => {
    it('should parse page number from query', () => {
      const router = createMockRouter({ p: '3' });
      const filters = pageFilters(router);

      expect(filters.page).toBe(3);
    });

    it('should default to page 1 when no page specified', () => {
      const router = createMockRouter({});
      const filters = pageFilters(router);

      expect(filters.page).toBe(1);
    });
  });

  describe('order', () => {
    it('should return order from query', () => {
      const router = createMockRouter({ order: 'providerNameAZ' });
      const filters = pageFilters(router);

      expect(filters.order).toBe('providerNameAZ');
    });

    it('should default to random when no order specified', () => {
      const router = createMockRouter({});
      const filters = pageFilters(router);

      expect(filters.order).toBe('random');
    });
  });

  describe('accountsPerPage', () => {
    it('should parse accounts per page from query', () => {
      const router = createMockRouter({ accountsPerPage: '10' });
      const filters = pageFilters(router);

      expect(filters.accountsPerPage).toBe(10);
    });

    it('should default to 5 when not specified', () => {
      const router = createMockRouter({});
      const filters = pageFilters(router);

      expect(filters.accountsPerPage).toBe(5);
    });
  });

  describe('count', () => {
    it('should count all active filters including search', () => {
      const router = createMockRouter({
        q: 'test',
        standardcurrent: 'true',
        nomonthlyfee: 'true',
        branchbanking: 'true',
      });
      const filters = pageFilters(router);

      expect(filters.count).toBe(4); // 1 search + 1 type + 1 feature + 1 access
    });

    it('should return 0 when no filters active', () => {
      const router = createMockRouter({});
      const filters = pageFilters(router);

      expect(filters.count).toBe(0);
    });
  });

  describe('isFilterActive', () => {
    it('should return true for active filters', () => {
      const router = createMockRouter({
        standardcurrent: 'true',
        nomonthlyfee: 'true',
      });
      const filters = pageFilters(router);

      expect(filters.isFilterActive('standardCurrent')).toBe(true);
      expect(filters.isFilterActive('noMonthlyFee')).toBe(true);
    });

    it('should return false for inactive filters', () => {
      const router = createMockRouter({});
      const filters = pageFilters(router);

      expect(filters.isFilterActive('standardCurrent')).toBe(false);
    });
  });

  describe('navigation functions', () => {
    it('should call router.push with correct arguments for setOrder', async () => {
      const mockPush = jest.fn().mockResolvedValue(true);
      const router = createMockRouter({ p: '2' });
      router.push = mockPush;
      const filters = pageFilters(router);

      await filters.setOrder('providerNameAZ');

      expect(mockPush).toHaveBeenCalledWith(
        '?order=providerNameAZ&p=1',
        undefined,
        { scroll: false },
      );
    });

    it('should call router.push with correct arguments for setAccountsPerPage', async () => {
      const mockPush = jest.fn().mockResolvedValue(true);
      const router = createMockRouter({});
      router.push = mockPush;
      const filters = pageFilters(router);

      await filters.setAccountsPerPage(10);

      expect(mockPush).toHaveBeenCalledWith(
        '?accountsPerPage=10&p=1',
        undefined,
        { scroll: false },
      );
    });
  });

  describe('href functions', () => {
    it('should generate correct href for removeFilterHref', () => {
      const router = createMockRouter({
        standardcurrent: 'true',
        nomonthlyfee: 'true',
      });
      const filters = pageFilters(router);

      const href = filters.removeFilterHref('standardCurrent');
      expect(href).toContain('nomonthlyfee=true');
      expect(href).toContain('p=1');
      expect(href).not.toContain('standardcurrent');
    });

    it('should generate correct href for removeSearchQueryHref', () => {
      const router = createMockRouter({
        q: 'test',
        standardcurrent: 'true',
      });
      const filters = pageFilters(router);

      const href = filters.removeSearchQueryHref();
      expect(href).toContain('standardcurrent=true');
      expect(href).toContain('p=1');
      expect(href).not.toContain('q=');
    });

    it('should generate correct href for setPageHref', () => {
      const router = createMockRouter({
        standardcurrent: 'true',
      });
      const filters = pageFilters(router);

      const href = filters.setPageHref(3);
      expect(href).toContain('standardcurrent=true');
      expect(href).toContain('p=3');
    });

    it('should generate correct href for clearFiltersHref', () => {
      const router = createMockRouter({
        q: 'test',
        standardcurrent: 'true',
        nomonthlyfee: 'true',
        branchbanking: 'true',
        order: 'providerNameAZ',
        p: '3',
      });
      const filters = pageFilters(router);

      const href = filters.clearFiltersHref();
      expect(href).toBe('?');
    });
  });
});
