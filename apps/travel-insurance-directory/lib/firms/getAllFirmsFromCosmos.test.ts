import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { getAllFirmsFromCosmos } from './getAllFirmsFromCosmos';

const mockFetchAll = jest.fn();

jest.mock('../database/dbConnect', () => ({
  dbConnect: jest.fn().mockResolvedValue({
    container: {
      items: {
        query: () => ({ fetchAll: mockFetchAll }),
      },
    },
  }),
}));

const makeFirm = (
  overrides: Partial<TravelInsuranceFirmDocument>,
): TravelInsuranceFirmDocument =>
  ({
    id: '1',
    fca_number: 100000,
    registered_name: 'Test Firm',
    approved_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    hidden_at: null,
    reregistered_at: null,
    reregister_approved_at: null,
    confirmed_disclaimer: false,
    status: 'active' as const,
    covered_by_ombudsman_question: null,
    website_address: null,
    principals: [],
    offices: [],
    ...overrides,
  } as TravelInsuranceFirmDocument);

describe('getAllFirmsFromCosmos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns paginated firms from Cosmos', async () => {
    const firms = [makeFirm({ id: '1' }), makeFirm({ id: '2' })];
    mockFetchAll.mockResolvedValue({ resources: firms });

    const result = await getAllFirmsFromCosmos({}, 1, 10);

    expect(result.firms).toHaveLength(2);
    expect(result.pagination.totalItems).toBe(2);
    expect(result.pagination.page).toBe(1);
  });

  it('paginates results correctly', async () => {
    const firms = Array.from({ length: 25 }, (_, i) =>
      makeFirm({ id: String(i), fca_number: 100000 + i }),
    );
    mockFetchAll.mockResolvedValue({ resources: firms });

    const result = await getAllFirmsFromCosmos({}, 2, 10);

    expect(result.firms).toHaveLength(10);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.totalPages).toBe(3);
    expect(result.pagination.totalItems).toBe(25);
  });

  it('returns empty result when no firms match', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    const result = await getAllFirmsFromCosmos(
      { firmName: 'nonexistent' },
      1,
      10,
    );

    expect(result.firms).toHaveLength(0);
    expect(result.pagination.totalItems).toBe(0);
  });

  it('handles null resources from Cosmos', async () => {
    mockFetchAll.mockResolvedValue({ resources: null });

    const result = await getAllFirmsFromCosmos({}, 1, 10);

    expect(result.firms).toHaveLength(0);
    expect(result.pagination.totalItems).toBe(0);
  });
});
