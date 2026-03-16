export const transformTaxCode = (taxCode: string | undefined) => {
  return taxCode?.toUpperCase().trim().replaceAll(/\s/g, '');
};
