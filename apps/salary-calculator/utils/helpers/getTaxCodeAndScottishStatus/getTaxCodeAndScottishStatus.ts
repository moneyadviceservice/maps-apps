export type TaxCodeAndScottishTaxStatus = {
  taxCode: string;
  isScottishTaxCode: boolean;
  isScottishResident: boolean;
};

export function getTaxCodeAndScottishStatus(
  taxCodeInput: string,
  isScottishResidentInput: boolean,
): TaxCodeAndScottishTaxStatus {
  const taxCode = taxCodeInput.trim();
  let upperTaxCode = taxCode.toUpperCase();

  let isScottishTaxCode = upperTaxCode.startsWith('S');
  let isScottishResident = isScottishTaxCode ? true : isScottishResidentInput;

  if (
    isScottishResident &&
    upperTaxCode &&
    (!upperTaxCode.startsWith('S') || upperTaxCode.startsWith('C'))
  ) {
    if (upperTaxCode.startsWith('C')) {
      upperTaxCode = 'S' + upperTaxCode.slice(1);
    } else {
      upperTaxCode = `S${upperTaxCode}`;
    }
    isScottishTaxCode = true;
    isScottishResident = true;
  }

  return {
    taxCode: upperTaxCode,
    isScottishTaxCode,
    isScottishResident,
  };
}
