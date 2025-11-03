import { englandNiWalesTaxRates, scottishTaxRates } from './constants';
import {
  Country,
  EnglishTaxRates,
  ScottishTaxRates,
  SupportedEnglishTaxYear,
  SupportedScottishTaxYear,
} from './types';

interface Options {
  taxYear?: SupportedScottishTaxYear | SupportedEnglishTaxYear;
  country?: Country;
}

export const getHmrcRates = (
  options?: Options,
): EnglishTaxRates | ScottishTaxRates => {
  const isScotland = options?.country === 'Scotland';
  const taxRates = isScotland ? scottishTaxRates : englandNiWalesTaxRates;
  const taxYearToUse = options?.taxYear ?? '2025/26';

  if (!Object.hasOwn(taxRates, taxYearToUse)) {
    throw new Error(
      `Tax Year ${taxYearToUse} is not currently supported for ${
        options?.country ?? 'England/NI/Wales'
      }`,
    );
  }

  if (isScotland) {
    return (taxRates as Record<SupportedScottishTaxYear, ScottishTaxRates>)[
      taxYearToUse as SupportedScottishTaxYear
    ];
  } else {
    return (taxRates as Record<SupportedEnglishTaxYear, EnglishTaxRates>)[
      taxYearToUse as SupportedEnglishTaxYear
    ];
  }
};

export function isScottishTaxRates(
  taxRates: EnglishTaxRates | ScottishTaxRates,
): taxRates is ScottishTaxRates {
  return taxRates.COUNTRY === 'Scotland';
}
