import { getLocalizedCopy } from './getLocalizedCopy';

describe('getLocalizedCopy', () => {
  const copy = { en: 'Enter an amount', cy: 'Rhowch swm' };

  it('returns English by default', () => {
    expect(getLocalizedCopy(copy, 'en')).toBe('Enter an amount');
  });

  it('returns Welsh when lang is cy and Welsh copy is set', () => {
    expect(getLocalizedCopy(copy, 'cy')).toBe('Rhowch swm');
  });

  it('returns English when Welsh copy is empty', () => {
    expect(getLocalizedCopy({ en: 'Enter an amount', cy: '' }, 'cy')).toBe(
      'Enter an amount',
    );
  });
});
