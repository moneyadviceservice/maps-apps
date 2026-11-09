import { safeT } from './safeT';

describe('safeT', () => {
  it('returns the translation if present', () => {
    const t = () => 'Hello world';
    expect(safeT(t, 'foo')).toBe('Hello world');
  });

  it('returns undefined if translation is missing (returns key)', () => {
    const t = (key: string) => key;
    expect(safeT(t, 'foo.bar')).toBeUndefined();
  });

  it('returns undefined if translation is empty', () => {
    const t = () => '';
    expect(safeT(t, 'foo.bar')).toBeUndefined();
  });

  it('returns undefined if translation is whitespace', () => {
    const t = () => ' ';
    expect(safeT(t, 'foo.bar')).toBeUndefined();
  });
});
