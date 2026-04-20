import pageFilters, { extractSearchFilters } from './pageFilters';

describe('extractSearchFilters', () => {
  it('returns defaults from empty query', () => {
    const filters = extractSearchFilters({});
    expect(filters.postcode).toBe('');
    expect(filters.lat).toBeNull();
    expect(filters.lng).toBeNull();
    expect(filters.fuelTypes).toEqual(['E10']);
    expect(filters.amenities).toEqual([]);
    expect(filters.radius).toBe(5);
    expect(filters.sort).toBe('price');
    expect(filters.page).toBe(1);
    expect(filters.perPage).toBe(3);
  });

  it('extracts postcode and coordinates', () => {
    const filters = extractSearchFilters({
      postcode: 'SW1A 1AA',
      lat: '51.5',
      lng: '-0.12',
    });
    expect(filters.postcode).toBe('SW1A 1AA');
    expect(filters.lat).toBe(51.5);
    expect(filters.lng).toBe(-0.12);
  });

  it('extracts single fuel type', () => {
    const filters = extractSearchFilters({ fuelType: 'E10' });
    expect(filters.fuelTypes).toEqual(['E10']);
  });

  it('defaults to E10 when no fuel type selected', () => {
    expect(extractSearchFilters({}).fuelTypes).toEqual(['E10']);
  });

  it('extracts boolean flags', () => {
    const filters = extractSearchFilters({
      supermarket: 'true',
      motorway: 'true',
      open24h: 'true',
    });
    expect(filters.supermarket).toBe(true);
    expect(filters.motorway).toBe(true);
    expect(filters.open24h).toBe(true);
  });

  it('extracts pagination params', () => {
    const filters = extractSearchFilters({ p: '3', perPage: '50' });
    expect(filters.page).toBe(3);
    expect(filters.perPage).toBe(50);
  });

  it('maps toilets flag to customer_toilets amenity', () => {
    const filters = extractSearchFilters({ toilets: 'true' });
    expect(filters.amenities).toContain('customer_toilets');
  });
});

describe('pageFilters', () => {
  const mockRouter = (query: Record<string, string | undefined>) => ({
    query,
    push: jest.fn().mockResolvedValue(true),
  });

  it('returns correct defaults', () => {
    const filters = pageFilters(mockRouter({}));
    expect(filters.page).toBe(1);
    expect(filters.perPage).toBe(3);
    expect(filters.sort).toBe('price');
    expect(filters.postcode).toBe('');
    expect(filters.count).toBe(0);
  });

  it('counts active filters', () => {
    const filters = pageFilters(
      mockRouter({
        fuelType: 'E10',
        supermarket: 'true',
        toilets: 'true',
      }),
    );
    expect(filters.count).toBe(2);
  });

  it('removes a single filter', () => {
    const filters = pageFilters(
      mockRouter({ supermarket: 'true', motorway: 'true' }),
    );
    const href = filters.removeFilterHref('supermarket');
    expect(href).not.toContain('supermarket');
    expect(href).toContain('motorway');
  });

  it('generates page href', () => {
    const filters = pageFilters(mockRouter({ postcode: 'SW1A' }));
    const href = filters.setPageHref(2);
    expect(href).toContain('p=2');
    expect(href).toContain('postcode=SW1A');
  });

  it('navigates on setSort', async () => {
    const router = mockRouter({ postcode: 'SW1A' });
    const filters = pageFilters(router);
    await filters.setSort('price');
    expect(router.push).toHaveBeenCalledWith(
      expect.stringContaining('sort=price'),
      undefined,
      { scroll: false },
    );
  });

  it('navigates on setPerPage', async () => {
    const router = mockRouter({});
    const filters = pageFilters(router);
    await filters.setPerPage('50');
    expect(router.push).toHaveBeenCalledWith(
      expect.stringContaining('perPage=50'),
      undefined,
      { scroll: false },
    );
  });

  it('checks isFilterActive', () => {
    const filters = pageFilters(mockRouter({ supermarket: 'true' }));
    expect(filters.isFilterActive('supermarket')).toBe(true);
    expect(filters.isFilterActive('motorway')).toBe(false);
  });

  it('preserves language param in URLs', () => {
    const filters = pageFilters(
      mockRouter({ language: 'en', postcode: 'SW1A' }),
    );
    const href = filters.setPageHref(1);
    expect(href).toContain('language=en');
  });
});
