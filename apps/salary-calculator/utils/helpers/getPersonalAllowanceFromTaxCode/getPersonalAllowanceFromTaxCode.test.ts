import { getPersonalAllowanceFromTaxCode } from './getPersonalAllowanceFromTaxCode';

describe('getPersonalAllowanceFromTaxCode', () => {
  it('returns 12570 for 1257L', () => {
    expect(getPersonalAllowanceFromTaxCode('1257L')).toBe(12570);
  });

  it('returns 13730 for 1373M', () => {
    expect(getPersonalAllowanceFromTaxCode('1373M')).toBe(13730);
  });

  it('returns 11430 for 1143N', () => {
    expect(getPersonalAllowanceFromTaxCode('1143N')).toBe(11430);
  });

  it('returns 11000 for 1100T', () => {
    expect(getPersonalAllowanceFromTaxCode('1100T')).toBe(11000);
  });

  it('returns 0 for 0T', () => {
    expect(getPersonalAllowanceFromTaxCode('0T')).toBe(0);
  });

  it('returns 0 for BR', () => {
    expect(getPersonalAllowanceFromTaxCode('BR')).toBe(0);
  });

  it('returns -4750 for K475', () => {
    expect(getPersonalAllowanceFromTaxCode('K475')).toBe(-4750);
  });

  it('returns 12570 for C1257L (Welsh)', () => {
    expect(
      getPersonalAllowanceFromTaxCode('C1257L', 12570, 'England/NI/Wales'),
    ).toBe(12570);
  });

  it('returns 0 for C0T (Welsh)', () => {
    expect(
      getPersonalAllowanceFromTaxCode('C0T', 12570, 'England/NI/Wales'),
    ).toBe(0);
  });

  it('returns 12570 for S1257L (Scottish)', () => {
    expect(getPersonalAllowanceFromTaxCode('S1257L', 12570, 'Scotland')).toBe(
      12570,
    );
  });

  it('returns 0 for S0T (Scottish)', () => {
    expect(getPersonalAllowanceFromTaxCode('S0T', 12570, 'Scotland')).toBe(0);
  });

  it('returns -4750 for SK475 (Scottish)', () => {
    expect(getPersonalAllowanceFromTaxCode('SK475', 12570, 'Scotland')).toBe(
      -4750,
    );
  });

  it('returns default allowance when taxCode is empty string', () => {
    expect(getPersonalAllowanceFromTaxCode('')).toBe(12570);
  });

  it('extracts number from code with digits', () => {
    expect(getPersonalAllowanceFromTaxCode('1257L')).toBe(12570); // num = 1257
    expect(getPersonalAllowanceFromTaxCode('1100T')).toBe(11000); // num = 1100
    expect(getPersonalAllowanceFromTaxCode('K475')).toBe(-4750); // num = 475
  });

  it('handles code with no digits', () => {
    expect(getPersonalAllowanceFromTaxCode('L')).toBe(12570); // num = 0, fallback
    expect(getPersonalAllowanceFromTaxCode('BR')).toBe(0); // num = 0, but in special codes
    expect(getPersonalAllowanceFromTaxCode('XYZ')).toBe(12570); // num = 0, fallback
  });
});
