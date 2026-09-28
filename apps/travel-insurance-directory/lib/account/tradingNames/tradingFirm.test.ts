import { createMockTradingFirm } from 'components/FirmSummary/mockFirm';
import { updateFirm } from 'lib/firms/updateFirm';

import {
  buildTradingFirmPayload,
  createTradingFirm,
  deleteTradingFirm,
  deleteTradingFirmDocument,
  fetchTradingDocByMainAndName,
  fetchTradingDocForMainById,
  fetchTradingDocsByMainFirmId,
  fetchTradingFirmById,
  upsertTradingFirm,
} from './tradingFirm';

const mockFetchAll = jest.fn();
const mockQuery = jest.fn().mockReturnValue({ fetchAll: mockFetchAll });
const mockCreate = jest.fn();
const mockRead = jest.fn();
const mockDelete = jest.fn();
const mockItem = jest.fn(() => ({ read: mockRead, delete: mockDelete }));

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: {
        items: { query: mockQuery, create: mockCreate },
        item: mockItem,
      },
    }),
}));

jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: jest.fn(),
}));

const mockedUpdateFirm = updateFirm as jest.Mock;

const tradingDoc = (
  overrides: Parameters<typeof createMockTradingFirm>[0] = {},
) =>
  createMockTradingFirm({
    id: 'trading-1',
    main_firm_id: 'main-1',
    fca_number: 610022,
    registered_name: 'Trading Brand',
    ...overrides,
  });

describe('buildTradingFirmPayload', () => {
  it('builds a hidden trading document linked to the main firm', () => {
    const payload = buildTradingFirmPayload({
      name: 'Just Travel Cover',
      mainFrn: 610022,
      mainFirmId: 'main-1',
    });

    expect(payload).toMatchObject({
      type: 'trading',
      main_firm_id: 'main-1',
      fca_number: 610022,
      registered_name: 'Just Travel Cover',
      status: 'hidden',
      website_address: null,
      office: null,
      trip_covers: [],
    });
    expect(payload.searchable).toMatchObject({
      registered_name_lower: 'just travel cover',
      fca_number_string: '610022',
    });
    expect(payload.created_at).toBe(payload.updated_at);
    expect(payload.approved_at).toBeNull();
  });
});

describe('fetchTradingDocsByMainFirmId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
  });

  it('returns trading documents for the main firm', async () => {
    const docs = [tradingDoc(), tradingDoc({ id: 'trading-2' })];
    mockFetchAll.mockResolvedValue({ resources: docs });

    const result = await fetchTradingDocsByMainFirmId('main-1');

    expect(result.success).toBe(true);
    expect(result.response).toEqual(docs);
    expect(mockQuery).toHaveBeenCalledWith({
      query: expect.stringContaining("c.type = 'trading'"),
      parameters: [{ name: '@mainFirmId', value: 'main-1' }],
    });
  });

  it('returns an empty list when no trading documents exist', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    const result = await fetchTradingDocsByMainFirmId('main-1');

    expect(result.success).toBe(true);
    expect(result.response).toEqual([]);
  });

  it('returns failure when the query throws', async () => {
    mockFetchAll.mockRejectedValue(new Error('Cosmos down'));

    const result = await fetchTradingDocsByMainFirmId('main-1');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to fetch trading firms');
  });
});

describe('fetchTradingDocByMainAndName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
  });

  it('returns the first match with a normalized name parameter', async () => {
    const doc = tradingDoc();
    mockFetchAll.mockResolvedValue({ resources: [doc] });

    const result = await fetchTradingDocByMainAndName(
      'main-1',
      '  Brand Name  ',
    );

    expect(result.success).toBe(true);
    expect(result.response).toEqual(doc);
    expect(mockQuery).toHaveBeenCalledWith({
      query: expect.stringContaining('LOWER(c.registered_name)'),
      parameters: [
        { name: '@mainFirmId', value: 'main-1' },
        { name: '@nameLower', value: 'brand name' },
      ],
    });
  });

  it('returns not found when no document matches', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    const result = await fetchTradingDocByMainAndName('main-1', 'Missing');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Trading firm not found');
  });

  it('returns failure when the query throws', async () => {
    mockFetchAll.mockRejectedValue(new Error('Cosmos down'));

    const result = await fetchTradingDocByMainAndName('main-1', 'Brand');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to fetch trading firm');
  });
});

describe('fetchTradingFirmById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a trading document from a point read', async () => {
    const doc = tradingDoc();
    mockRead.mockResolvedValue({ resource: doc });

    const result = await fetchTradingFirmById('trading-1');

    expect(result.success).toBe(true);
    expect(result.response).toEqual(doc);
    expect(mockItem).toHaveBeenCalledWith('trading-1', 'trading-1');
  });

  it('returns not found when the resource is not a trading document', async () => {
    mockRead.mockResolvedValue({
      resource: { id: 'main-1', type: 'main' },
    });

    const result = await fetchTradingFirmById('main-1');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Trading firm not found');
  });

  it('returns failure when the point read throws', async () => {
    mockRead.mockRejectedValue(new Error('Not found'));

    const result = await fetchTradingFirmById('missing');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to fetch trading firm');
  });
});

describe('fetchTradingDocForMainById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
  });

  it('returns a trading document scoped by id and main FRN', async () => {
    const doc = tradingDoc();
    mockFetchAll.mockResolvedValue({ resources: [doc] });

    const result = await fetchTradingDocForMainById('trading-1', 610022);

    expect(result.success).toBe(true);
    expect(result.response).toEqual(doc);
    expect(mockQuery).toHaveBeenCalledWith({
      query: expect.stringContaining('c.fca_number = @mainFrn'),
      parameters: [
        { name: '@id', value: 'trading-1' },
        { name: '@mainFrn', value: 610022 },
      ],
    });
  });

  it('returns not found when no document matches', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    const result = await fetchTradingDocForMainById('trading-1', 610022);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Trading firm not found');
  });

  it('returns failure when the query throws', async () => {
    mockFetchAll.mockRejectedValue(new Error('Cosmos down'));

    const result = await fetchTradingDocForMainById('trading-1', 610022);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to fetch trading firm');
  });
});

describe('createTradingFirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
  });

  it('returns an error when a trading name already exists for the main firm', async () => {
    mockFetchAll.mockResolvedValue({ resources: [tradingDoc()] });

    const payload = buildTradingFirmPayload({
      name: 'Trading Brand',
      mainFrn: 610022,
      mainFirmId: 'main-1',
    });
    const result = await createTradingFirm(payload);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Trading firm already exists');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('creates a trading document when no duplicate exists', async () => {
    const created = tradingDoc({ id: 'trading-new' });
    mockFetchAll.mockResolvedValue({ resources: [] });
    mockCreate.mockResolvedValue({ resource: created });

    const payload = buildTradingFirmPayload({
      name: 'New Brand',
      mainFrn: 610022,
      mainFirmId: 'main-1',
    });
    const result = await createTradingFirm(payload);

    expect(result.success).toBe(true);
    expect(result.response).toEqual(created);
    expect(mockCreate).toHaveBeenCalledWith(payload);
  });

  it('returns failure when create throws', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });
    mockCreate.mockRejectedValue(new Error('Write failed'));

    const result = await createTradingFirm(
      buildTradingFirmPayload({
        name: 'New Brand',
        mainFrn: 610022,
        mainFirmId: 'main-1',
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to create trading firm');
  });
});

describe('deleteTradingFirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes by document id partition key', async () => {
    mockDelete.mockResolvedValue(undefined);

    const result = await deleteTradingFirm('trading-1');

    expect(result.success).toBe(true);
    expect(mockItem).toHaveBeenCalledWith('trading-1', 'trading-1');
    expect(mockDelete).toHaveBeenCalled();
  });

  it('returns failure when delete throws', async () => {
    mockDelete.mockRejectedValue(new Error('Delete failed'));

    const result = await deleteTradingFirm('trading-1');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to delete trading firm');
  });
});

describe('deleteTradingFirmDocument', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes using the document id as partition key', async () => {
    mockDelete.mockResolvedValue(undefined);

    const result = await deleteTradingFirmDocument(tradingDoc());

    expect(result.success).toBe(true);
    expect(mockItem).toHaveBeenCalledWith('trading-1', 'trading-1');
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('falls back to fca_number partition key when id partition fails', async () => {
    mockDelete
      .mockRejectedValueOnce(new Error('Wrong partition'))
      .mockResolvedValueOnce(undefined);

    const doc = tradingDoc({ fca_number: 610022 });
    const result = await deleteTradingFirmDocument(doc);

    expect(result.success).toBe(true);
    expect(mockItem).toHaveBeenNthCalledWith(1, 'trading-1', 'trading-1');
    expect(mockItem).toHaveBeenNthCalledWith(2, 'trading-1', '610022');
    expect(mockDelete).toHaveBeenCalledTimes(2);
  });

  it('returns failure when all partition key attempts fail', async () => {
    mockDelete.mockRejectedValue(new Error('Delete failed'));

    const result = await deleteTradingFirmDocument(tradingDoc());

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to delete trading firm');
    expect(mockDelete).toHaveBeenCalledTimes(2);
  });
});

describe('upsertTradingFirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
  });

  it('updates an existing trading document', async () => {
    const existing = tradingDoc();
    const updated = tradingDoc({ registered_name: 'Updated Brand' });
    mockFetchAll.mockResolvedValue({ resources: [existing] });
    mockedUpdateFirm.mockResolvedValue({ success: true, response: updated });

    const result = await upsertTradingFirm({
      name: 'Updated Brand',
      mainFrn: 610022,
      mainFirmId: 'main-1',
    });

    expect(result.success).toBe(true);
    expect(result.response).toEqual(updated);
    expect(mockedUpdateFirm).toHaveBeenCalledWith('trading-1', {
      registered_name: 'Updated Brand',
      searchable: expect.objectContaining({
        registered_name_lower: 'updated brand',
        fca_number_string: '610022',
      }),
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns failure when update fails', async () => {
    mockFetchAll.mockResolvedValue({ resources: [tradingDoc()] });
    mockedUpdateFirm.mockResolvedValue({ success: false });

    const result = await upsertTradingFirm({
      name: 'Updated Brand',
      mainFrn: 610022,
      mainFirmId: 'main-1',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to update trading firm');
  });

  it('creates a trading document when none exists for the name', async () => {
    const created = tradingDoc({
      id: 'trading-new',
      registered_name: 'New Brand',
    });
    mockFetchAll.mockResolvedValue({ resources: [] });
    mockCreate.mockResolvedValue({ resource: created });

    const result = await upsertTradingFirm({
      name: 'New Brand',
      mainFrn: 610022,
      mainFirmId: 'main-1',
    });

    expect(result.success).toBe(true);
    expect(result.response).toEqual(created);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'trading',
        main_firm_id: 'main-1',
        registered_name: 'New Brand',
      }),
    );
    expect(mockedUpdateFirm).not.toHaveBeenCalled();
  });
});
