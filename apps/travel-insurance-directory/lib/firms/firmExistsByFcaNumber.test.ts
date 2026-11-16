jest.mock('lib/database/dbConnect');

const { cosmosDbItemsQueryMock, resetCosmosDbItemsQueryMock } =
  jest.requireMock('lib/database/dbConnect');

import { firmExistsByFcaNumber } from './firmExistsByFcaNumber';

describe('firmExistsByFcaNumber', () => {
  beforeEach(() => {
    resetCosmosDbItemsQueryMock();
  });

  it('returns false when the FRN is empty', async () => {
    await expect(firmExistsByFcaNumber('  ')).resolves.toBe(false);
    expect(cosmosDbItemsQueryMock.query).not.toHaveBeenCalled();
  });

  it('returns false when no main firm matches the FRN', async () => {
    cosmosDbItemsQueryMock.fetchAll.mockResolvedValue({ resources: [] });

    await expect(firmExistsByFcaNumber('123456')).resolves.toBe(false);
    expect(cosmosDbItemsQueryMock.query).toHaveBeenCalledTimes(1);
    const spec = cosmosDbItemsQueryMock.query.mock.calls[0]?.[0] as {
      query: string;
      parameters: { name: string; value: string | number | null }[];
    };
    expect(spec.query).toContain("c.type = 'main'");
    expect(spec.parameters).toEqual([
      { name: '@fcaNumberNumeric', value: 123456 },
      { name: '@fcaNumberString', value: '123456' },
    ]);
  });

  it.each([
    ['single match', ['firm-id-1'], '999'],
    ['duplicate rows', ['firm-id-1', 'firm-id-2'], '111'],
  ])('returns true when %s', async (_label, resources, frn) => {
    cosmosDbItemsQueryMock.fetchAll.mockResolvedValue({ resources });

    await expect(firmExistsByFcaNumber(frn)).resolves.toBe(true);
  });
});
