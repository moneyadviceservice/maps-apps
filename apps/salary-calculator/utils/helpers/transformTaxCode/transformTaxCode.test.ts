import { transformTaxCode } from './transformTaxCode';

describe('transformTaxCode', () => {
  it('returns undefined for undefined taxCode', () => {
    expect(transformTaxCode(undefined)).toEqual(undefined);
  });

  it('removes whitespace', () => {
    expect(transformTaxCode('1234 L')).toEqual('1234L');
  });

  it('transform to uppercase', () => {
    expect(transformTaxCode('1234 l')).toEqual('1234L');
  });

  it('trims whitespace', () => {
    expect(transformTaxCode('   1234 L   ')).toEqual('1234L');
  });
});
