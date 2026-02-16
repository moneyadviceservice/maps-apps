import {
  buildListingsCountQuery,
  buildListingsQuery,
} from './buildListingsQuery';

describe('buildListingsQuery', () => {
  it('returns query with status, offset and limit params', () => {
    const { query, parameters } = buildListingsQuery({}, 1, 10);
    expect(query).toContain('c.status = @status');
    expect(query).toContain('ORDER BY c.display_order ASC');
    expect(query).toContain('OFFSET @offset LIMIT @limit');
    expect(parameters).toEqual([
      { name: '@status', value: 'active' },
      { name: '@offset', value: 0 },
      { name: '@limit', value: 10 },
    ]);
  });

  it('computes offset from page and limit', () => {
    const { parameters } = buildListingsQuery({}, 3, 5);
    expect(parameters.find((p) => p.name === '@offset')?.value).toBe(10);
  });
});

describe('buildListingsCountQuery', () => {
  it('returns COUNT query with status param only', () => {
    const { query, parameters } = buildListingsCountQuery({});
    expect(query).toContain('SELECT VALUE COUNT(1)');
    expect(query).toContain('c.status = @status');
    expect(parameters).toEqual([{ name: '@status', value: 'active' }]);
  });
});
