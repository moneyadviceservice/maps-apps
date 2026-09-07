import { createMockFirm } from 'components/FirmSummary/mockFirm';

import { fetchMainFirmByFcaNumber } from './fetchMainFirmByFcaNumber';

const mockFetchAll = jest.fn();
const mockQuery = jest.fn();

jest.mock('lib/database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: {
        items: { query: mockQuery },
      },
    }),
}));

describe('fetchMainFirmByFcaNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReturnValue({ fetchAll: mockFetchAll });
  });

  it('returns main firm when found', async () => {
    const main = createMockFirm({ fca_number: 610022 });
    mockFetchAll.mockResolvedValue({ resources: [main] });

    const result = await fetchMainFirmByFcaNumber(610022);

    expect(result.success).toBe(true);
    expect(result.response).toEqual(main);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringContaining("c.type = 'main'"),
        parameters: [{ name: '@fcaNumber', value: 610022 }],
      }),
    );
  });

  it('returns failure when no main firm exists', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    const result = await fetchMainFirmByFcaNumber(999);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Main firm not found');
  });
});
