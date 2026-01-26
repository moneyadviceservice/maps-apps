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
      { taxCode: '1257L', isScottishTaxCode: false, isScottishResident: true },
    ],
    [
      'C1257L',
      true,
      { taxCode: 'C1257L', isScottishTaxCode: false, isScottishResident: true },
    ],
    [
      'S1257L',
      true,
      { taxCode: 'S1257L', isScottishTaxCode: true, isScottishResident: true },
    ],
    [
      ' 1257L ',
      true,
      { taxCode: '1257L', isScottishTaxCode: false, isScottishResident: true },
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
      { taxCode: 'C1257L', isScottishTaxCode: false, isScottishResident: true },
    ],
    // NT should stay NT even if Scottish
    [
      'NT',
      true,
      { taxCode: 'NT', isScottishTaxCode: false, isScottishResident: true },
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
