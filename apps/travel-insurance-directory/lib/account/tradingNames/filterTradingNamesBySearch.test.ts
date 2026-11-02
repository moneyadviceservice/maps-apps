import { filterTradingNamesBySearch } from './filterTradingNamesBySearch';

describe('filterTradingNamesBySearch', () => {
  const names = ['Alpha Ltd', 'Beta Trading', 'Gamma Co'];

  it('returns all names when query is empty', () => {
    expect(filterTradingNamesBySearch(names, '')).toEqual(names);
  });

  it('returns all names when query is whitespace only', () => {
    expect(filterTradingNamesBySearch(names, '   ')).toEqual(names);
  });

  it('filters case-insensitively by substring', () => {
    expect(filterTradingNamesBySearch(names, 'beta')).toEqual(['Beta Trading']);
  });

  it('trims query before matching', () => {
    expect(filterTradingNamesBySearch(names, '  alpha  ')).toEqual([
      'Alpha Ltd',
    ]);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterTradingNamesBySearch(names, 'zzz')).toEqual([]);
  });
});
