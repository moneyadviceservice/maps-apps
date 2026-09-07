import { createMockFirm } from 'components/FirmSummary/mockFirm';
import type {
  MainTravelInsuranceFirmDocument,
  Principal,
  TradingTravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

import { dbConnect } from '../database/dbConnect';
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

const principal = (first: string, last: string, irn: string): Principal => ({
  first_name: first,
  last_name: last,
  job_title: null,
  email_address: null,
  telephone_number: null,
  confirmed_disclaimer: true,
  senior_manager_name: null,
  individual_reference_number: irn,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
});

const makeMainFirm = (
  overrides: Partial<MainTravelInsuranceFirmDocument> & { id: string },
): MainTravelInsuranceFirmDocument => createMockFirm(overrides);

const makeTradingFirm = (
  overrides: Partial<TradingTravelInsuranceFirmDocument> & {
    id: string;
    registered_name: string;
  },
): TradingTravelInsuranceFirmDocument =>
  ({
    ...createMockFirm({ id: overrides.id }),
    type: 'trading',
    main_firm_id: 'main-parent',
    ...overrides,
  }) as TradingTravelInsuranceFirmDocument;

describe('getAllFirmsFromCosmos', () => {
  const originalCi = process.env.CI;

  beforeEach(() => {
    process.env.CI = 'false';
    jest.clearAllMocks();
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
  });

  afterEach(() => {
    if (originalCi === undefined) {
      delete process.env.CI;
    } else {
      process.env.CI = originalCi;
    }
  });

  it('returns paginated firms from Cosmos', async () => {
    const firms = [makeMainFirm({ id: '1' }), makeMainFirm({ id: '2' })];
    mockFetchAll.mockResolvedValue({ resources: firms });

    const result = await getAllFirmsFromCosmos({}, 1, 10);

    expect(result.firms).toHaveLength(2);
    expect(result.pagination.totalItems).toBe(2);
    expect(result.pagination.page).toBe(1);
  });

  it('uses ORDER BY created_at DESC when sortBy and sortDir are omitted', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    await getAllFirmsFromCosmos({}, 1, 10);

    const querySpec = mockQuery.mock.calls[0]?.[0] as { query: string };
    expect(querySpec.query).toContain('ORDER BY c.created_at DESC');
  });

  it('uses ASC for Cosmos-backed sortBy when sortDir is omitted', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    await getAllFirmsFromCosmos({ sortBy: 'fcaNumber' }, 1, 10);

    const querySpec = mockQuery.mock.calls[0]?.[0] as { query: string };
    expect(querySpec.query).toContain('ORDER BY c.fca_number ASC');
  });

  it('paginates results correctly', async () => {
    const firms = Array.from({ length: 25 }, (_, i) =>
      makeMainFirm({ id: String(i), fca_number: 100000 + i }),
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

  it('does not add principalName tokens to Cosmos query (filtered in memory)', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    await getAllFirmsFromCosmos({ principalName: 'JoHn' }, 1, 10);

    const querySpec = mockQuery.mock.calls[0]?.[0] as {
      query: string;
      parameters: { name: string; value: string | number }[];
    };

    expect(querySpec.query).not.toContain('@principalToken');
    expect(querySpec.query).not.toContain('c.principal.first_name');
    expect(querySpec.parameters).not.toEqual(
      expect.arrayContaining([{ name: '@principalToken0', value: 'john' }]),
    );
  });

  it('includes trading row when main principal matches principalName search', async () => {
    const main = makeMainFirm({
      id: 'main-1',
      fca_number: 610022,
      principal: principal('Amy', 'Adams', 'IRN-AA'),
    });
    const trading = makeTradingFirm({
      id: 'trading-1',
      fca_number: 610022,
      registered_name: 'Trading Brand',
    });
    const otherMain = makeMainFirm({
      id: 'main-2',
      fca_number: 999999,
      principal: principal('Bob', 'Brown', 'IRN-BB'),
    });

    mockFetchAll.mockResolvedValue({ resources: [main, trading, otherMain] });

    const result = await getAllFirmsFromCosmos({ principalName: 'amy' }, 1, 10);

    expect(
      result.firms.map((f) => f.id).sort((a, b) => a.localeCompare(b)),
    ).toEqual(['main-1', 'trading-1']);
    expect(result.mainPrincipalByFca['610022']).toEqual(main.principal);
    expect(result.mainRegisteredNameByFca['610022']).toBe(main.registered_name);
    expect(result.mainApprovedAtByFca['610022']).toBe(main.approved_at);
    expect(result.mainReregistrationByFca['610022']).toEqual({
      reregistered_at: main.reregistered_at,
      reregister_approved_at: main.reregister_approved_at,
    });
  });

  it('returns both main and trading documents from Cosmos', async () => {
    const main = makeMainFirm({
      id: 'parent',
      registered_name: 'Just Insurance Agents Limited',
    });
    const tradingDoc = makeTradingFirm({
      id: 'tn-doc',
      registered_name: 'Justtravelcover.com',
    });

    mockFetchAll.mockResolvedValue({ resources: [main, tradingDoc] });

    const result = await getAllFirmsFromCosmos({}, 1, 10);
    expect(result.firms).toHaveLength(2);
    expect(
      result.firms.map((f) => f.id).sort((a, b) => a.localeCompare(b)),
    ).toEqual(['parent', 'tn-doc']);
  });

  it('sorts by best principal full name when sortBy is principalName (asc/desc)', async () => {
    const firmAlexHarper = makeMainFirm({
      id: 'alex-harper',
      fca_number: 100001,
      principal: principal('Alex', 'Harper', 'IRN-AH'),
    });
    const firmAndrewYule = makeMainFirm({
      id: 'andrew-yule',
      fca_number: 100002,
      principal: principal('Andrew', 'Yule', 'IRN-AY'),
    });
    const firmChrisPayne = makeMainFirm({
      id: 'chris-payne',
      fca_number: 100003,
      principal: principal('Chris', 'Payne', 'IRN-CP'),
    });
    const firmChrisGooden = makeMainFirm({
      id: 'chris-gooden',
      fca_number: 100004,
      principal: principal('Chris', 'Gooden', 'IRN-CG'),
    });
    const firmKrishnaShastri = makeMainFirm({
      id: 'krishna-shastri',
      fca_number: 100005,
      principal: principal('Krishna', 'Shastri', 'IRN-KS'),
    });
    const firmKevinMcMullan = makeMainFirm({
      id: 'kevin-mcmullan',
      fca_number: 100006,
      principal: principal('Kevin', 'McMullan', 'IRN-KM'),
    });
    const firmTrading = makeTradingFirm({
      id: 'trading-only',
      fca_number: firmAlexHarper.fca_number,
      registered_name: 'Trading Brand',
    });
    const firmBestPrincipal = makeMainFirm({
      id: 'best-of-many',
      fca_number: 100007,
      principal: principal('Amy', 'Zed', 'IRN-AZ'),
    });

    mockFetchAll.mockResolvedValue({
      resources: [
        firmAndrewYule,
        firmChrisPayne,
        firmKrishnaShastri,
        firmTrading,
        firmAlexHarper,
        firmKevinMcMullan,
        firmBestPrincipal,
        firmChrisGooden,
      ],
    });

    const asc = await getAllFirmsFromCosmos(
      { sortBy: 'principalName', sortDir: 'asc' },
      1,
      20,
    );
    expect(asc.firms.map((f) => f.id)).toEqual([
      'trading-only',
      'alex-harper',
      'best-of-many',
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
      'trading-only',
      'alex-harper',
    ]);
  });

  it('does not use Cosmos ORDER BY registered_name when sorting by firmName column', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    await getAllFirmsFromCosmos({ sortBy: 'firmName', sortDir: 'desc' }, 1, 10);

    const querySpec = mockQuery.mock.calls[0]?.[0] as { query: string };
    expect(querySpec.query).not.toContain('ORDER BY c.registered_name');
    expect(querySpec.query).toContain('ORDER BY c.created_at');
  });

  it('sorts by admin firm display name (case-insensitive) when sortBy is firmName', async () => {
    const zebraMain = makeMainFirm({
      id: 'zebra-main',
      fca_number: 100_001,
      registered_name: 'Zebra Parent Ltd',
      principal: principal('Ann', 'North', 'IRN-ZM'),
    });
    const zebraTrading = makeTradingFirm({
      id: 'zebra-trading',
      fca_number: 100_001,
      registered_name: 'www.example.com',
    });
    const betaMain = makeMainFirm({
      id: 'beta-main',
      fca_number: 100_002,
      registered_name: 'Beta Main Ltd',
      principal: principal('Ben', 'Owen', 'IRN-BM'),
    });

    mockFetchAll.mockResolvedValue({
      resources: [zebraTrading, zebraMain, betaMain],
    });

    const asc = await getAllFirmsFromCosmos(
      { sortBy: 'firmName', sortDir: 'asc' },
      1,
      10,
    );
    expect(asc.firms.map((f) => f.id)).toEqual([
      'beta-main',
      'zebra-trading',
      'zebra-main',
    ]);

    const desc = await getAllFirmsFromCosmos(
      { sortBy: 'firmName', sortDir: 'desc' },
      1,
      10,
    );
    expect(desc.firms.map((f) => f.id)).toEqual([
      'zebra-main',
      'zebra-trading',
      'beta-main',
    ]);
  });

  it('when CI is true returns fixture data without calling dbConnect', async () => {
    process.env.CI = 'true';
    const result = await getAllFirmsFromCosmos({}, 1, 50);
    expect(result.firms.length).toBeGreaterThan(0);
    expect(jest.mocked(dbConnect)).not.toHaveBeenCalled();
  });
});
