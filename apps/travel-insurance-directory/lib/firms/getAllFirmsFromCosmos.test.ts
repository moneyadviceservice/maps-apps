import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import type {
  MainTravelInsuranceFirmDocument,
  Principal,
  TravelInsuranceFirmDocument,
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

const firmIds = (firms: TravelInsuranceFirmDocument[]) =>
  firms.map((firm) => firm.id);

async function expectInMemoryColumnSort(
  sortBy: string,
  resources: TravelInsuranceFirmDocument[],
  expectedAscIds: string[],
  expectedDescIds: string[],
  pageSize = 10,
) {
  mockFetchAll.mockResolvedValue({ resources });

  const asc = await getAllFirmsFromCosmos(
    { sortBy, sortDir: 'asc' },
    1,
    pageSize,
  );
  expect(firmIds(asc.firms)).toEqual(expectedAscIds);

  const desc = await getAllFirmsFromCosmos(
    { sortBy, sortDir: 'desc' },
    1,
    pageSize,
  );
  expect(firmIds(desc.firms)).toEqual(expectedDescIds);
}

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
    const trading = createMockTradingFirm({
      id: 'trading-1',
      fca_number: 610022,
      main_firm_id: main.id,
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
    expect(result.mainPrincipalByFirmId[main.id]).toEqual(main.principal);
    expect(result.mainRegisteredNameByFirmId[main.id]).toBe(
      main.registered_name,
    );
    expect(result.mainApprovedAtByFirmId[main.id]).toBe(main.approved_at);
    expect(result.mainReregistrationByFirmId[main.id]).toEqual({
      reregistered_at: main.reregistered_at,
      reregister_approved_at: main.reregister_approved_at,
    });
  });

  it('includes the trading row when searching the main principal email', async () => {
    const main = makeMainFirm({
      id: 'main-email',
      fca_number: 610022,
      principal: {
        ...principal('Amy', 'Adams', 'IRN-AA'),
        email_address: 'amy.adams@example.com',
      },
    });
    const other = makeMainFirm({
      id: 'other-same-fca',
      fca_number: 610022,
      principal: {
        ...principal('Other', 'Person', 'IRN-OP'),
        email_address: 'other@example.com',
      },
    });
    const trading = createMockTradingFirm({
      id: 'trading-email',
      fca_number: 610022,
      registered_name: 'Trading Brand',
      main_firm_id: main.id,
    });

    mockFetchAll.mockResolvedValue({ resources: [other, main, trading] });

    const result = await getAllFirmsFromCosmos(
      { principalName: 'amy.adams@example.com' },
      1,
      10,
    );

    expect(result.firms.map((firm) => firm.id).sort()).toEqual([
      'main-email',
      'trading-email',
    ]);
    expect(result.mainPrincipalByFirmId[main.id]?.email_address).toBe(
      'amy.adams@example.com',
    );
    expect(result.mainPrincipalByFirmId[other.id]?.email_address).toBe(
      'other@example.com',
    );
  });

  it('loads the linked main principal when a firm-name search returns only the trading row', async () => {
    const main = makeMainFirm({
      id: 'main-arcus',
      fca_number: 610022,
      registered_name: 'Arcus Legal Ltd',
      principal: {
        ...principal('Amy', 'Adams', 'IRN-AA'),
        email_address: 'amy.adams@example.com',
      },
    });
    const trading = createMockTradingFirm({
      id: 'trading-arcus',
      fca_number: 610022,
      main_firm_id: main.id,
      registered_name: 'Arcus Surety',
    });

    mockFetchAll
      .mockResolvedValueOnce({ resources: [trading] })
      .mockResolvedValueOnce({ resources: [main] });

    const result = await getAllFirmsFromCosmos(
      { firmName: 'Arcus Surety' },
      1,
      10,
    );

    expect(result.firms.map((firm) => firm.id)).toEqual(['trading-arcus']);
    expect(result.mainPrincipalByFirmId[main.id]?.first_name).toBe('Amy');
    expect(result.mainRegisteredNameByFirmId[main.id]).toBe('Arcus Legal Ltd');
    const parentQuery = mockQuery.mock.calls[1]?.[0] as {
      query: string;
      parameters: { name: string; value: string[] }[];
    };
    expect(parentQuery.query).toContain('ARRAY_CONTAINS(@ids, c.id)');
    expect(parentQuery.parameters).toEqual([
      { name: '@ids', value: [main.id] },
    ]);
  });

  it('returns both main and trading documents from Cosmos', async () => {
    const main = makeMainFirm({
      id: 'parent',
      registered_name: 'Just Insurance Agents Limited',
    });
    const tradingDoc = createMockTradingFirm({
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
    const firmTrading = createMockTradingFirm({
      id: 'trading-only',
      fca_number: firmAlexHarper.fca_number,
      main_firm_id: firmAlexHarper.id,
      registered_name: 'Trading Brand',
    });
    const firmBestPrincipal = makeMainFirm({
      id: 'best-of-many',
      fca_number: 100007,
      principal: principal('Amy', 'Zed', 'IRN-AZ'),
    });

    await expectInMemoryColumnSort(
      'principalName',
      [
        firmAndrewYule,
        firmChrisPayne,
        firmKrishnaShastri,
        firmTrading,
        firmAlexHarper,
        firmKevinMcMullan,
        firmBestPrincipal,
        firmChrisGooden,
      ],
      [
        'trading-only',
        'alex-harper',
        'best-of-many',
        'andrew-yule',
        'chris-gooden',
        'chris-payne',
        'kevin-mcmullan',
        'krishna-shastri',
      ],
      [
        'krishna-shastri',
        'kevin-mcmullan',
        'chris-payne',
        'chris-gooden',
        'andrew-yule',
        'best-of-many',
        'trading-only',
        'alex-harper',
      ],
      20,
    );
  });

  it.each([
    ['firmName', 'ORDER BY c.registered_name'],
    ['status', 'ORDER BY c.status'],
  ])(
    'does not use Cosmos %s when sorting by that column',
    async (sortBy, forbiddenOrderBy) => {
      mockFetchAll.mockResolvedValue({ resources: [] });

      await getAllFirmsFromCosmos({ sortBy, sortDir: 'asc' }, 1, 10);

      const querySpec = mockQuery.mock.calls[0]?.[0] as { query: string };
      expect(querySpec.query).not.toContain(forbiddenOrderBy);
      expect(querySpec.query).toContain('ORDER BY c.created_at');
    },
  );

  it('sorts by admin firm display name (case-insensitive) when sortBy is firmName', async () => {
    const zebraMain = makeMainFirm({
      id: 'zebra-main',
      fca_number: 100_001,
      registered_name: 'Zebra Parent Ltd',
      principal: principal('Ann', 'North', 'IRN-ZM'),
    });
    const zebraTrading = createMockTradingFirm({
      id: 'zebra-trading',
      fca_number: 100_001,
      main_firm_id: zebraMain.id,
      registered_name: 'www.example.com',
    });
    const betaMain = makeMainFirm({
      id: 'beta-main',
      fca_number: 100_002,
      registered_name: 'Beta Main Ltd',
      principal: principal('Ben', 'Owen', 'IRN-BM'),
    });

    await expectInMemoryColumnSort(
      'firmName',
      [zebraTrading, zebraMain, betaMain],
      ['beta-main', 'zebra-trading', 'zebra-main'],
      ['zebra-main', 'zebra-trading', 'beta-main'],
    );
  });

  it('sorts by directory status label alphabetically when sortBy is status', async () => {
    const approved = makeMainFirm({
      id: 'approved',
      status: 'active',
    });
    const pending = makeMainFirm({
      id: 'pending',
      status: 'pending_approval',
    });
    const hidden = makeMainFirm({
      id: 'hidden',
      status: 'hidden',
      hidden_reason: null,
    });
    const noLongerAuthorised = makeMainFirm({
      id: 'fca-blocked',
      status: 'hidden',
      hidden_reason: 'Invalid_FCA',
    });
    const noLongerValid = createMockTradingFirm({
      id: 'trading-blocked',
      registered_name: 'Inactive trading',
      status: 'hidden',
      hidden_reason: 'Trading_name-Inactive_or_Not_Current',
    });

    await expectInMemoryColumnSort(
      'status',
      [pending, noLongerValid, approved, noLongerAuthorised, hidden],
      ['approved', 'hidden', 'fca-blocked', 'trading-blocked', 'pending'],
      ['pending', 'trading-blocked', 'fca-blocked', 'hidden', 'approved'],
    );
  });

  it('when CI is true returns fixture data without calling dbConnect', async () => {
    process.env.CI = 'true';
    const result = await getAllFirmsFromCosmos({}, 1, 50);
    expect(result.firms.length).toBeGreaterThan(0);
    expect(jest.mocked(dbConnect)).not.toHaveBeenCalled();
  });
});
