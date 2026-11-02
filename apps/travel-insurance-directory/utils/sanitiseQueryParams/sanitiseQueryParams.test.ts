import { URLSearchParams } from 'url';

import { QueryParams, sanitiseQueryParams } from './sanitiseQueryParams';

jest.mock('data/components/filterOptions/filterConstants', () => ({
  FILTER_SECTIONS: [
    {
      paramKey: 'age',
      options: [{ value: '0-16' }, { value: '17-69' }],
    },
    {
      paramKey: 'trip_type',
      options: [{ value: 'single_trip' }, { value: 'annual' }],
    },
  ],
  LIMIT_OPTIONS: [10, 20, 30],
}));

describe('sanitiseQueryParams', () => {
  it('returns an empty object for empty input', () => {
    expect(sanitiseQueryParams({})).toEqual({});
  });

  it('strips out unrecognized keys completely (URL pollution protection)', () => {
    const input: QueryParams = {
      maliciousKey: 'true',
      script: '<script>alert(1)</script>',
      age: '0-16',
    };

    expect(sanitiseQueryParams(input)).toEqual({ age: '0-16' });
  });

  it('removes invalid values for recognized keys', () => {
    const input: QueryParams = {
      age: '99-100',
      trip_type: 'single_trip',
    };

    expect(sanitiseQueryParams(input)).toEqual({ trip_type: 'single_trip' });
  });

  it('filters arrays to keep only valid values', () => {
    const input: QueryParams = {
      age: ['0-16', 'invalid-age', '17-69'],
    };

    expect(sanitiseQueryParams(input)).toEqual({
      age: ['0-16', '17-69'],
    });
  });

  it('flattens a single valid array item into a string', () => {
    const input: QueryParams = {
      age: ['invalid-age', '17-69'],
    };

    expect(sanitiseQueryParams(input)).toEqual({
      age: '17-69',
    });
  });

  describe('limit parameter', () => {
    it('keeps a valid limit', () => {
      expect(sanitiseQueryParams({ limit: '20' })).toEqual({ limit: '20' });
    });

    it('strips an invalid limit', () => {
      expect(sanitiseQueryParams({ limit: '15' })).toEqual({});
      expect(sanitiseQueryParams({ limit: 'not-a-number' })).toEqual({});
    });

    it('takes the first valid limit if an array is provided', () => {
      expect(sanitiseQueryParams({ limit: ['20', '30'] })).toEqual({
        limit: '20',
      });
    });
  });

  describe('URLSearchParams support', () => {
    it('processes URLSearchParams exactly like standard objects', () => {
      const searchParams = new URLSearchParams();
      searchParams.append('age', '0-16');
      searchParams.append('age', 'invalid-age');
      searchParams.append('age', '17-69');
      searchParams.append('maliciousKey', 'true');
      searchParams.append('limit', '30');

      const result = sanitiseQueryParams(searchParams);

      expect(result).toEqual({
        age: ['0-16', '17-69'],
        limit: '30',
      });
    });
  });
});
