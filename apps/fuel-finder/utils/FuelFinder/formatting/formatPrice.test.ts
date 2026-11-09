import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats integer pence', () => {
    expect(formatPrice(133)).toBe('133.0p');
  });

  it('formats decimal pence', () => {
    expect(formatPrice(132.9)).toBe('132.9p');
  });

  it('rounds to one decimal place', () => {
    expect(formatPrice(132.95)).toBe('132.9p');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('0.0p');
  });
});
