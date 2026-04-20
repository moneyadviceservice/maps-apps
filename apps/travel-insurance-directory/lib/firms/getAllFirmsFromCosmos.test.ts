import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { getAllFirmsFromCosmos } from './getAllFirmsFromCosmos';

const mockFetchAll = jest.fn();
const mockQuery = jest.fn();

jest.mock('../database/dbConnect', () => ({
  dbConnect: jest.fn().mockResolvedValue({
    container: {
      items: {
        query: (...args: unknown[]) => mockQuery(...args),
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
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
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

  it('builds principalName search as token match against first_name or last_name', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    await getAllFirmsFromCosmos({ principalName: 'JoHn' }, 1, 10);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    const querySpec = mockQuery.mock.calls[0]?.[0] as {
      query: string;
      parameters: { name: string; value: string | number }[];
    };

    expect(querySpec.query).toContain('CONTAINS(LOWER(p.first_name)');
    expect(querySpec.query).toContain('CONTAINS(LOWER(p.last_name)');
    expect(querySpec.query).toContain('c.trading_names');
    expect(querySpec.query).toContain('tn.principals');
    expect(querySpec.parameters).toEqual(
      expect.arrayContaining([{ name: '@principalToken0', value: 'john' }]),
    );
  });

  it('matches when any principalName token matches (OR across tokens)', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    await getAllFirmsFromCosmos({ principalName: 'john   smith' }, 1, 10);

    const querySpec = mockQuery.mock.calls[0]?.[0] as {
      query: string;
      parameters: { name: string; value: string | number }[];
    };

    expect(querySpec.query).toContain('@principalToken0');
    expect(querySpec.query).toContain('@principalToken1');
    expect(querySpec.query).toContain(' OR ');
    expect(querySpec.parameters).toEqual(
      expect.arrayContaining([
        { name: '@principalToken0', value: 'john' },
        { name: '@principalToken1', value: 'smith' },
      ]),
    );
  });

  it('dedupes top-level trading-name docs when parent declares trading_names', async () => {
    const parent = makeFirm({
      id: 'parent',
      registered_name: 'Just Insurance Agents Limited',
      trading_names: [
        {
          fca_number: 100000,
          registered_name: 'Justtravelcover.com',
          website_address: null,
          approved_at: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          hidden_at: null,
          reregistered_at: null,
          reregister_approved_at: null,
          confirmed_disclaimer: false,
          status: 'active',
          covered_by_ombudsman_question: null,
          service_details: null,
          trip_covers: [],
          medical_specialisms: {
            specialised_medical_conditions_covers_all: null,
            will_not_cover_some_medical_conditions: null,
            will_cover_undergoing_treatment: null,
            terminal_prognosis_cover: null,
            likely_not_cover_medical_condition: null,
            cover_undergoing_treatment: null,
            specialised_medical_conditions_cover: null,
          },
          offices: [],
          principals: [],
          searchable: {
            registered_name_lower: 'justtravelcover.com',
            fca_number_string: '100000',
            keywords: [],
          },
        },
      ],
    });
    const tradingDoc = makeFirm({
      id: 'tn-doc',
      registered_name: 'Justtravelcover.com',
      trading_names: [],
    });

    mockFetchAll.mockResolvedValue({ resources: [parent, tradingDoc] });

    const result = await getAllFirmsFromCosmos({}, 1, 10);
    expect(result.firms).toHaveLength(1);
    expect(result.firms[0].id).toBe('parent');
  });

  it('sorts by best principal full name when sortBy is principalName (asc/desc)', async () => {
    const firmAlexHarper = makeFirm({
      id: 'alex-harper',
      principals: [
        {
          first_name: 'Alex',
          last_name: 'Harper',
          job_title: null,
          email_address: null,
          telephone_number: null,
          confirmed_disclaimer: true,
          senior_manager_name: null,
          individual_reference_number: 'IRN-AH',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
    const firmAndrewYule = makeFirm({
      id: 'andrew-yule',
      principals: [
        {
          first_name: 'Andrew',
          last_name: 'Yule',
          job_title: null,
          email_address: null,
          telephone_number: null,
          confirmed_disclaimer: true,
          senior_manager_name: null,
          individual_reference_number: 'IRN-AY',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
    const firmChrisPayne = makeFirm({
      id: 'chris-payne',
      principals: [
        {
          first_name: 'Chris',
          last_name: 'Payne',
          job_title: null,
          email_address: null,
          telephone_number: null,
          confirmed_disclaimer: true,
          senior_manager_name: null,
          individual_reference_number: 'IRN-CP',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
    const firmChrisGooden = makeFirm({
      id: 'chris-gooden',
      principals: [
        {
          first_name: 'Chris',
          last_name: 'Gooden',
          job_title: null,
          email_address: null,
          telephone_number: null,
          confirmed_disclaimer: true,
          senior_manager_name: null,
          individual_reference_number: 'IRN-CG',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
    const firmKrishnaShastri = makeFirm({
      id: 'krishna-shastri',
      principals: [
        {
          first_name: 'Krishna',
          last_name: 'Shastri',
          job_title: null,
          email_address: null,
          telephone_number: null,
          confirmed_disclaimer: true,
          senior_manager_name: null,
          individual_reference_number: 'IRN-KS',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
    const firmKevinMcMullan = makeFirm({
      id: 'kevin-mcmullan',
      principals: [
        {
          first_name: 'Kevin',
          last_name: 'McMullan',
          job_title: null,
          email_address: null,
          telephone_number: null,
          confirmed_disclaimer: true,
          senior_manager_name: null,
          individual_reference_number: 'IRN-KM',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
    const firmMissing = makeFirm({
      id: 'missing',
      principals: [],
    });
    const firmBestPrincipalFromMany = makeFirm({
      id: 'best-of-many',
      principals: [
        {
          first_name: 'Zoe',
          last_name: 'Alpha',
          job_title: null,
          email_address: null,
          telephone_number: null,
          confirmed_disclaimer: true,
          senior_manager_name: null,
          individual_reference_number: 'IRN-ZA',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          first_name: '  Amy ',
          last_name: 'Zed',
          job_title: null,
          email_address: null,
          telephone_number: null,
          confirmed_disclaimer: true,
          senior_manager_name: null,
          individual_reference_number: 'IRN-AZ',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });

    // Provide out-of-order resources to ensure in-memory sort drives output.
    mockFetchAll.mockResolvedValue({
      resources: [
        firmAndrewYule,
        firmChrisPayne,
        firmKrishnaShastri,
        firmMissing,
        firmAlexHarper,
        firmKevinMcMullan,
        firmBestPrincipalFromMany,
        firmChrisGooden,
      ],
    });

    const asc = await getAllFirmsFromCosmos(
      { sortBy: 'principalName', sortDir: 'asc' },
      1,
      20,
    );
    expect(asc.firms.map((f) => f.id)).toEqual([
      'missing',
      'alex-harper',
      'best-of-many', // best principal is Amy Zed (not Zoe Alpha)
      'andrew-yule',
      'chris-gooden',
      'chris-payne',
      'kevin-mcmullan',
      'krishna-shastri',
    ]);

    const desc = await getAllFirmsFromCosmos(
      { sortBy: 'principalName', sortDir: 'desc' },
      1,
      20,
    );
    expect(desc.firms.map((f) => f.id)).toEqual([
      'krishna-shastri',
      'kevin-mcmullan',
      'chris-payne',
      'chris-gooden',
      'andrew-yule',
      'best-of-many',
      'alex-harper',
      'missing',
    ]);
  });
});
