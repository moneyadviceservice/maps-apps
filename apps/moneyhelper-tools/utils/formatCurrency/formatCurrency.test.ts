import { formatCurrency } from './formatCurrency';

describe('formatCurrency function', () => {
  it('tests number is formatted as expected for positive values', () => {
    const formattedValue = formatCurrency(2000);

    expect(formattedValue).toEqual('£2,000.00');
  });

  it('tests string is formatted as expected for positive values', () => {
    const formattedValue = formatCurrency('2000');

    expect(formattedValue).toEqual('£2,000.00');
  });

  it('tests number is formatted as expected for negative values', () => {
    const formattedValue = formatCurrency(-2000);

    expect(formattedValue).toEqual('£-2,000.00');
  });

  it('tests string is formatted as expected for negative values', () => {
    const formattedValue = formatCurrency('-2000');

    expect(formattedValue).toEqual('£-2,000.00');
  });
});
