import { filterQueryData } from './filterQueryData';
describe('filterQueryData', () => {
  it('should return an object with the correct value for updateChunk', () => {
    const query = {
      income: '1000',
      pot: '20000',
      chunk: '5000',
    };
    const result = filterQueryData(query, 'Chunk');
    expect(result).toEqual({
      ...query,
      updateChunk: '5000',
    });
  });

  it('should return an object with the correct value for updateMonth with fallback value', () => {
    const query = {
      pot: '20000',
    };
    const fallbackResult = filterQueryData(query, 'Month', '500');
    expect(fallbackResult).toEqual({
      ...query,
      updateMonth: '500',
    });
  });

  it('should return an object with the retrieved value for updateChunk value from URL ', () => {
    const query = {
      income: '1000',
      pot: '20000',
      chunk: '5000',
      updateChunk: '10000',
    };
    const fallbackResult = filterQueryData(query, 'Chunk');
    expect(fallbackResult).toEqual({
      ...query,
      chunk: '5000',
      updateChunk: '10000',
    });
  });
});
