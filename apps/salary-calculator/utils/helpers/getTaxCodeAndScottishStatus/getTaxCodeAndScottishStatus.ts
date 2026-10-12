export type TaxCodeAndScottishTaxStatus = {
  taxCode: string;
  isScottishTaxCode: boolean;
  isScottishResident: boolean;
};

export function getTaxCodeAndScottishStatus(
  taxCodeInput: string,
  isScottishResidentInput: boolean,
): TaxCodeAndScottishTaxStatus {
  const taxCode = taxCodeInput.replaceAll(/\s/g, '').trim();
  const upperTaxCode = taxCode.toUpperCase();

  if (upperTaxCode === 'NT') {
    return {
      taxCode: 'NT',
      isScottishTaxCode: false,
      isScottishResident: isScottishResidentInput,
    };
  }

  const isScottishTaxCode = upperTaxCode.startsWith('S');
  const isScottishResident = isScottishTaxCode ? true : isScottishResidentInput;

  return {
    taxCode: upperTaxCode,
    isScottishTaxCode,
    isScottishResident,
  };
}
