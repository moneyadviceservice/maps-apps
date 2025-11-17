import { getTaxCodeAndScottishStatus } from './getTaxCodeAndScottishStatus';

describe('getTaxCodeAndScottishStatus', () => {
  test.each([
    // [taxCodeInput, isScottishResidentInput, expected]
    [
      'S1257L',
      false,
      { taxCode: 'S1257L', isScottishTaxCode: true, isScottishResident: true },
    ],
    [
      '1257L',
      false,
      { taxCode: '1257L', isScottishTaxCode: false, isScottishResident: false },
    ],
    [
      '1257L',
      true,
      { taxCode: 'S1257L', isScottishTaxCode: true, isScottishResident: true },
    ],
    [
      'C1257L',
      true,
      { taxCode: 'S1257L', isScottishTaxCode: true, isScottishResident: true },
    ],
    [
      'S1257L',
      true,
      { taxCode: 'S1257L', isScottishTaxCode: true, isScottishResident: true },
    ],
    [
      ' 1257L ',
      true,
      { taxCode: 'S1257L', isScottishTaxCode: true, isScottishResident: true },
    ],
    [
      '',
      false,
      { taxCode: '', isScottishTaxCode: false, isScottishResident: false },
    ],
    // Lowercase prefixes should be normalized to uppercase
    [
      's1257l',
      false,
      { taxCode: 'S1257L', isScottishTaxCode: true, isScottishResident: true },
    ],
    [
      'c1257l',
      true,
      { taxCode: 'S1257L', isScottishTaxCode: true, isScottishResident: true },
    ],
  ])(
    'returns correct status for taxCodeInput="%s" and isScottishResidentInput=%s',
    (taxCodeInput, isScottishResidentInput, expected) => {
      expect(
        getTaxCodeAndScottishStatus(taxCodeInput, isScottishResidentInput),
      ).toEqual(expected);
    },
  );
});
