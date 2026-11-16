import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';

import {
  ADMIN_COSMOS_VALID_SORT_FIELDS,
  filterDocumentsMatchingAdminCosmosWhere,
  orderDocumentsLikeAdminCosmosQuery,
} from './cosmosSemantics';

describe('cosmosSemantics', () => {
  it('exports the same sort keys as admin Cosmos SQL', () => {
    expect(ADMIN_COSMOS_VALID_SORT_FIELDS.fcaNumber).toBe('fca_number');
    expect(ADMIN_COSMOS_VALID_SORT_FIELDS.addedAt).toBe('created_at');
  });

  it('filterDocumentsMatchingAdminCosmosWhere applies base + fca + firmName like Cosmos WHERE', () => {
    const main = createMockFirm({
      id: 'm1',
      fca_number: 610_022,
      registered_name: 'Main Ltd',
    });
    const trading = createMockTradingFirm({
      id: 't1',
      fca_number: 610_022,
      registered_name: 'Trade',
      main_firm_id: main.id,
    });
    const noName = createMockFirm({
      id: 'bad',
      registered_name: '',
      fca_number: 1,
    });

    const all = [main, trading, noName];
    expect(
      filterDocumentsMatchingAdminCosmosWhere(all, {})
        .map((f) => f.id)
        .sort((a, b) => a.localeCompare(b)),
    ).toEqual(['m1', 't1'].sort((a, b) => a.localeCompare(b)));

    expect(
      filterDocumentsMatchingAdminCosmosWhere(all, { fcaNumber: '610' }).map(
        (f) => f.id,
      ),
    ).toEqual(['m1', 't1']);

    expect(
      filterDocumentsMatchingAdminCosmosWhere(all, {
        firmName: 'main',
      }).map((f) => f.id),
    ).toEqual(['m1']);
  });

  it('orderDocumentsLikeAdminCosmosQuery defaults to created_at desc', () => {
    const a = createMockFirm({
      id: 'old',
      created_at: '2024-01-01T00:00:00Z',
    });
    const b = createMockFirm({
      id: 'new',
      created_at: '2024-06-01T00:00:00Z',
    });
    const ordered = orderDocumentsLikeAdminCosmosQuery([a, b], {});
    expect(ordered.map((f) => f.id)).toEqual(['new', 'old']);
  });

  it('orderDocumentsLikeAdminCosmosQuery uses fca asc when sortBy is fcaNumber and sortDir omitted', () => {
    const hi = createMockFirm({ id: 'hi', fca_number: 999_999 });
    const lo = createMockFirm({ id: 'lo', fca_number: 100_001 });
    const ordered = orderDocumentsLikeAdminCosmosQuery([hi, lo], {
      sortBy: 'fcaNumber',
    });
    expect(ordered.map((f) => f.id)).toEqual(['lo', 'hi']);
  });
});
