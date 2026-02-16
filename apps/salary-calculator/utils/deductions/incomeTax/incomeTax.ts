import {
  englandNiWalesTaxRates,
  scottishTaxRates,
  SPECIAL_TAX_CODES_ENGLAND,
  SPECIAL_TAX_CODES_SCOTLAND,
} from 'utils/rates/constants';

import { getHmrcRates, isScottishTaxRates } from '../../rates/getHmrcRates';
import type {
  Country,
  CumulativePayeOptions,
  EnglishIncomeTax,
  EnglishTaxRates,
  ScottishIncomeTax,
  ScottishTaxRates,
  SupportedEnglishTaxYear,
  SupportedScottishTaxYear,
  TaxYear,
} from '../../rates/types';
import { transformTaxCode } from 'utils/helpers/transformTaxCode';

export function calculateEnglishTaxes({
  taxRates,
  taxableAnnualIncome,
  personalAllowance,
}: {
  taxRates: EnglishTaxRates;
  taxableAnnualIncome: number;
  personalAllowance: number;
}): EnglishIncomeTax {
  const {
    DEFAULT_PERSONAL_ALLOWANCE,
    BASIC_RATE,
    ADDITIONAL_BRACKET,
    HIGHER_RATE,
    HIGHER_BRACKET,
    ADDITIONAL_RATE,
  } = taxRates;
  const adjustedTaxableIncome = taxableAnnualIncome - personalAllowance;
  const adjustedHigherBracket = HIGHER_BRACKET - DEFAULT_PERSONAL_ALLOWANCE;

  // 3 rates of tax
  let basicRateTax = 0;
  let higherRateTax = 0;
  let additionalRateTax = 0;

  if (adjustedTaxableIncome > 0) {
    const basicAmount = Math.min(adjustedTaxableIncome, adjustedHigherBracket);
    basicRateTax = basicAmount * BASIC_RATE;
  }

  if (adjustedTaxableIncome > adjustedHigherBracket) {
    const amountOverToDiscard =
      adjustedTaxableIncome > ADDITIONAL_BRACKET
        ? adjustedTaxableIncome - ADDITIONAL_BRACKET
        : 0;
    const higherAmount =
      adjustedTaxableIncome - adjustedHigherBracket - amountOverToDiscard;
    higherRateTax = higherAmount * HIGHER_RATE;
  }

  if (adjustedTaxableIncome > ADDITIONAL_BRACKET) {
    const additionalAmount = adjustedTaxableIncome - ADDITIONAL_BRACKET;
    additionalRateTax = additionalAmount * ADDITIONAL_RATE;
  }

  // Income is lower than the personal allowance - no income tax
  return {
    total: basicRateTax + higherRateTax + additionalRateTax,
    incomeTaxType: 'England/NI/Wales',
    breakdown: {
      basicRateTax,
      higherRateTax,
      additionalRateTax,
    },
  };
}

export function calculateEnglishCumulativePayeTaxes({
  taxRates,
  cumulativeGrossIncome,
  monthNumber,
  cumulativeTaxPaid,
  personalAllowance,
}: {
  taxRates: EnglishTaxRates;
  cumulativeGrossIncome: number;
  monthNumber: number;
  cumulativeTaxPaid: number;
  personalAllowance?: number;
}): EnglishIncomeTax {
  const {
    DEFAULT_PERSONAL_ALLOWANCE,
    PERSONAL_ALLOWANCE_DROPOFF,
    BASIC_RATE,
    ADDITIONAL_BRACKET,
    HIGHER_RATE,
    HIGHER_BRACKET,
    ADDITIONAL_RATE,
  } = taxRates;

  const adjustedPersonalAllowance = getAdjustedPersonalAllowance({
    cumulativeGrossIncome,
    monthNumber,
    personalAllowance,
    DEFAULT_PERSONAL_ALLOWANCE,
    PERSONAL_ALLOWANCE_DROPOFF,
  });

  const adjustedTaxableIncome = Math.max(
    0,
    cumulativeGrossIncome - adjustedPersonalAllowance.proRated,
  );

  const adjustedHigherBracket = HIGHER_BRACKET - DEFAULT_PERSONAL_ALLOWANCE;

  const taxBreakdown = calculateTaxByBands({
    income: adjustedTaxableIncome,
    brackets: {
      higher: adjustedHigherBracket,
      additional: ADDITIONAL_BRACKET,
    },
    rates: {
      basic: BASIC_RATE,
      higher: HIGHER_RATE,
      additional: ADDITIONAL_RATE,
    },
  });

  const cumulativeTaxDue =
    taxBreakdown.basic + taxBreakdown.higher + taxBreakdown.additional;

  const monthlyTaxDue = Math.max(0, cumulativeTaxDue - cumulativeTaxPaid);

  const proportions = getProportions(taxBreakdown, cumulativeTaxDue);

  return {
    total: monthlyTaxDue,
    incomeTaxType: 'England/NI/Wales',
    breakdown: {
      basicRateTax: monthlyTaxDue * proportions.basic,
      higherRateTax: monthlyTaxDue * proportions.higher,
      additionalRateTax: monthlyTaxDue * proportions.additional,
    },
  };
}

function getAdjustedPersonalAllowance({
  cumulativeGrossIncome,
  monthNumber,
  personalAllowance,
  DEFAULT_PERSONAL_ALLOWANCE,
  PERSONAL_ALLOWANCE_DROPOFF,
}: {
  cumulativeGrossIncome: number;
  monthNumber: number;
  personalAllowance?: number;
  DEFAULT_PERSONAL_ALLOWANCE: number;
  PERSONAL_ALLOWANCE_DROPOFF: number;
}) {
  if (personalAllowance !== undefined) {
    const proRated = (personalAllowance * monthNumber) / 12;
    return { adjusted: personalAllowance, proRated };
  }

  const deduction =
    cumulativeGrossIncome >= PERSONAL_ALLOWANCE_DROPOFF
      ? (cumulativeGrossIncome - PERSONAL_ALLOWANCE_DROPOFF) / 2
      : 0;

  const adjusted = Math.max(
    0,
    DEFAULT_PERSONAL_ALLOWANCE - Math.max(deduction, 0),
  );
  const proRated = deduction > 0 ? adjusted : (adjusted * monthNumber) / 12;

  return { adjusted, proRated };
}

function calculateTaxByBands({
  income,
  brackets,
  rates,
}: {
  income: number;
  brackets: { higher: number; additional: number };
  rates: { basic: number; higher: number; additional: number };
}) {
  const basic =
    income > 0 ? Math.min(income, brackets.higher) * rates.basic : 0;

  const higher =
    income > brackets.higher
      ? (Math.min(income, brackets.additional) - brackets.higher) * rates.higher
      : 0;

  const additional =
    income > brackets.additional
      ? (income - brackets.additional) * rates.additional
      : 0;

  return { basic, higher, additional };
}

function getProportions(
  taxBreakdown: Record<string, number>,
  total: number,
): Record<string, number> {
  if (total <= 0) return { basic: 0, higher: 0, additional: 0 };

  return {
    basic: taxBreakdown.basic / total,
    higher: taxBreakdown.higher / total,
    additional: taxBreakdown.additional / total,
  };
}

function calculateScottishCumulativePayeTaxes({
  taxRates,
  cumulativeGrossIncome,
  monthNumber,
  cumulativeTaxPaid,
  personalAllowance,
}: {
  taxRates: ScottishTaxRates;
  cumulativeGrossIncome: number;
  monthNumber: number;
  cumulativeTaxPaid: number;
  personalAllowance?: number;
}): ScottishIncomeTax {
  const {
    DEFAULT_PERSONAL_ALLOWANCE,
    PERSONAL_ALLOWANCE_DROPOFF,
    STARTER_RATE,
    BASIC_BRACKET,
    BASIC_RATE,
    INTERMEDIATE_BRACKET,
    INTERMEDIATE_RATE,
    HIGHER_BRACKET,
    HIGHER_RATE,
    ADVANCED_BRACKET,
    ADVANCED_RATE,
    TOP_BRACKET,
    TOP_RATE,
  } = taxRates;

  // --- Personal Allowance Calculation ---
  let adjustedPersonalAllowance: number;
  let proRatedPersonalAllowance: number;

  if (personalAllowance === undefined) {
    const deduction =
      cumulativeGrossIncome >= PERSONAL_ALLOWANCE_DROPOFF
        ? (cumulativeGrossIncome - PERSONAL_ALLOWANCE_DROPOFF) / 2
        : 0;
    adjustedPersonalAllowance = Math.max(
      0,
      DEFAULT_PERSONAL_ALLOWANCE - Math.max(deduction, 0),
    );
    proRatedPersonalAllowance =
      deduction > 0
        ? adjustedPersonalAllowance
        : (adjustedPersonalAllowance * monthNumber) / 12;
  } else {
    adjustedPersonalAllowance = personalAllowance;
    proRatedPersonalAllowance = (adjustedPersonalAllowance * monthNumber) / 12;
  }

  const adjustedTaxableIncome = Math.max(
    0,
    cumulativeGrossIncome - proRatedPersonalAllowance,
  );

  // --- Band Calculation Helper ---
  function bandTax(
    income: number,
    lower: number,
    upper: number,
    rate: number,
  ): number {
    if (income <= lower) return 0;
    return (Math.min(income, upper) - lower) * rate;
  }

  // We need to minus 1 from the bracket limits so that the upper limit is inclusive
  // --- Bracket Boundaries ---
  const bracket1 = BASIC_BRACKET - DEFAULT_PERSONAL_ALLOWANCE - 1;
  const bracket2 = INTERMEDIATE_BRACKET - DEFAULT_PERSONAL_ALLOWANCE - 1;
  const bracket3 = HIGHER_BRACKET - DEFAULT_PERSONAL_ALLOWANCE - 1;
  const bracket4 = ADVANCED_BRACKET - DEFAULT_PERSONAL_ALLOWANCE - 1;

  // --- Calculate Each Band ---
  const starterRateTax = bandTax(
    adjustedTaxableIncome,
    0,
    bracket1,
    STARTER_RATE,
  );
  const basicRateTax = bandTax(
    adjustedTaxableIncome,
    bracket1,
    bracket2,
    BASIC_RATE,
  );
  const intermediateRateTax = bandTax(
    adjustedTaxableIncome,
    bracket2,
    bracket3,
    INTERMEDIATE_RATE,
  );
  const higherRateTax = bandTax(
    adjustedTaxableIncome,
    bracket3,
    bracket4,
    HIGHER_RATE,
  );
  const advancedRateTax = bandTax(
    adjustedTaxableIncome,
    bracket4,
    TOP_BRACKET,
    ADVANCED_RATE,
  );
  const topRateTax =
    adjustedTaxableIncome > TOP_BRACKET
      ? (adjustedTaxableIncome - TOP_BRACKET) * TOP_RATE
      : 0;

  // --- Totals and Proportions ---
  const cumulativeTaxDue =
    starterRateTax +
    basicRateTax +
    intermediateRateTax +
    higherRateTax +
    advancedRateTax +
    topRateTax;

  const monthlyTaxDue = Math.max(0, cumulativeTaxDue - cumulativeTaxPaid);

  function proportion(amount: number) {
    return cumulativeTaxDue > 0 ? amount / cumulativeTaxDue : 0;
  }

  return {
    total: monthlyTaxDue,
    incomeTaxType: 'Scotland',
    breakdown: {
      starterRateTax: monthlyTaxDue * proportion(starterRateTax),
      basicRateTax: monthlyTaxDue * proportion(basicRateTax),
      intermediateRateTax: monthlyTaxDue * proportion(intermediateRateTax),
      higherRateTax: monthlyTaxDue * proportion(higherRateTax),
      advancedRateTax: monthlyTaxDue * proportion(advancedRateTax),
      topRateTax: monthlyTaxDue * proportion(topRateTax),
    },
  };
}

function calculateScottishTaxes({
  taxRates,
  taxableAnnualIncome,
  personalAllowance,
}: {
  taxRates: ScottishTaxRates;
  taxableAnnualIncome: number;
  personalAllowance: number;
}): ScottishIncomeTax {
  const {
    DEFAULT_PERSONAL_ALLOWANCE,
    STARTER_RATE,
    BASIC_BRACKET,
    BASIC_RATE,
    INTERMEDIATE_BRACKET,
    INTERMEDIATE_RATE,
    HIGHER_BRACKET,
    HIGHER_RATE,
    ADVANCED_BRACKET,
    ADVANCED_RATE,
    TOP_BRACKET,
    TOP_RATE,
  } = taxRates;

  const adjustedTaxableIncome =
    taxableAnnualIncome <= DEFAULT_PERSONAL_ALLOWANCE
      ? 0
      : taxableAnnualIncome - personalAllowance;

  const bracket1 = BASIC_BRACKET - DEFAULT_PERSONAL_ALLOWANCE - 1;
  const bracket2 = INTERMEDIATE_BRACKET - DEFAULT_PERSONAL_ALLOWANCE - 1;
  const bracket3 = HIGHER_BRACKET - DEFAULT_PERSONAL_ALLOWANCE - 1;
  const bracket4 = ADVANCED_BRACKET - DEFAULT_PERSONAL_ALLOWANCE - 1;

  const calcBandTax = (
    income: number,
    lower: number,
    upper: number,
    rate: number,
  ): number => {
    if (income <= lower) return 0;
    const taxableSection = Math.min(income, upper) - lower;
    return taxableSection * rate;
  };

  const starterRateTax = calcBandTax(
    adjustedTaxableIncome,
    0,
    bracket1,
    STARTER_RATE,
  );
  const basicRateTax = calcBandTax(
    adjustedTaxableIncome,
    bracket1,
    bracket2,
    BASIC_RATE,
  );
  const intermediateRateTax = calcBandTax(
    adjustedTaxableIncome,
    bracket2,
    bracket3,
    INTERMEDIATE_RATE,
  );
  const higherRateTax = calcBandTax(
    adjustedTaxableIncome,
    bracket3,
    bracket4,
    HIGHER_RATE,
  );
  const advancedRateTax = calcBandTax(
    adjustedTaxableIncome,
    bracket4,
    TOP_BRACKET,
    ADVANCED_RATE,
  );
  const topRateTax =
    adjustedTaxableIncome > TOP_BRACKET
      ? (adjustedTaxableIncome - TOP_BRACKET) * TOP_RATE
      : 0;

  const total =
    starterRateTax +
    basicRateTax +
    intermediateRateTax +
    higherRateTax +
    advancedRateTax +
    topRateTax;

  return {
    total,
    incomeTaxType: 'Scotland',
    breakdown: {
      starterRateTax,
      basicRateTax,
      intermediateRateTax,
      higherRateTax,
      advancedRateTax,
      topRateTax,
    },
  };
}

// Calculates an indivudals income tax against annual taxable income
// Note: National Insurance contributions are not included here, see `calculateEmployeeNationalInsurance` instead
export const calculateIncomeTax = ({
  taxYear,
  country,
  taxableAnnualIncome,
  personalAllowance,
  cumulativePaye,
  taxCode,
}: {
  taxYear?: TaxYear;
  country?: Country;
  taxableAnnualIncome?: number;
  personalAllowance?: number;
  cumulativePaye?: CumulativePayeOptions;
  taxCode?: string;
}): EnglishIncomeTax | ScottishIncomeTax => {
  const taxRates = getHmrcRates({ taxYear, country });
  const isScottish = isScottishTaxRates(taxRates);
  const code = transformTaxCode(taxCode);
  const specialCodes = isScottish
    ? SPECIAL_TAX_CODES_SCOTLAND
    : SPECIAL_TAX_CODES_ENGLAND;

  if (isFlatRateCode(code, specialCodes, taxableAnnualIncome)) {
    return calculateFlatRateTax({
      code: code as string,
      flatRate: specialCodes[code as string],
      taxableAnnualIncome: taxableAnnualIncome as number,
      isScottish,
    });
  }

  if (cumulativePaye) {
    return calculateCumulativeTax({
      ...cumulativePaye,
      taxRates,
      personalAllowance,
      isScottish,
    });
  }

  validateRequiredFields(taxableAnnualIncome, personalAllowance);

  return calculateStandardTax({
    taxRates,
    taxableAnnualIncome: taxableAnnualIncome as number,
    personalAllowance: personalAllowance as number,
    isScottish,
  });
};

// ---------------- Helper functions ----------------

function isFlatRateCode(
  code: string | undefined,
  specialCodes: Record<string, number>,
  income?: number,
): boolean {
  return !!code && code in specialCodes && typeof income === 'number';
}

export function calculateFlatRateTax({
  flatRate,
  taxableAnnualIncome,
  isScottish,
}: {
  code: string;
  flatRate: number;
  taxableAnnualIncome: number;
  isScottish: boolean;
}): EnglishIncomeTax | ScottishIncomeTax {
  const total = taxableAnnualIncome * flatRate;
  return isScottish
    ? buildScottishFlatRate(total, flatRate, taxableAnnualIncome)
    : buildEnglishFlatRate(total, flatRate, taxableAnnualIncome);
}

// Special Flat-Rate Codes for Scotland:
// eg. SBR, SD0, SD1, SD2, SD3, D0, D1, D2, D3, NT

export function buildScottishFlatRate(
  total: number,
  flatRate: number,
  income: number,
  taxYear: SupportedScottishTaxYear = '2025/26',
): ScottishIncomeTax {
  const rates = scottishTaxRates[taxYear];
  return {
    total,
    incomeTaxType: 'Scotland',
    breakdown: {
      starterRateTax: flatRate === rates.STARTER_RATE ? income * flatRate : 0,
      basicRateTax: flatRate === rates.BASIC_RATE ? income * flatRate : 0,
      intermediateRateTax:
        flatRate === rates.INTERMEDIATE_RATE ? income * flatRate : 0,
      higherRateTax: flatRate === rates.HIGHER_RATE ? income * flatRate : 0,
      advancedRateTax: flatRate === rates.ADVANCED_RATE ? income * flatRate : 0,
      topRateTax: flatRate === rates.TOP_RATE ? income * flatRate : 0,
    },
  };
}

// Special Flat-Rate Codes for England/NI/Wales:
// eg. BR, D0, D1, NT, CBR, CD0, CD1
export function buildEnglishFlatRate(
  total: number,
  flatRate: number,
  income: number,
  taxYear: SupportedEnglishTaxYear = '2025/26',
): EnglishIncomeTax {
  const rates = englandNiWalesTaxRates[taxYear];
  return {
    total,
    incomeTaxType: 'England/NI/Wales',
    breakdown: {
      basicRateTax: flatRate === rates.BASIC_RATE ? income * flatRate : 0,
      higherRateTax: flatRate === rates.HIGHER_RATE ? income * flatRate : 0,
      additionalRateTax:
        flatRate === rates.ADDITIONAL_RATE ? income * flatRate : 0,
    },
  };
}

export function calculateCumulativeTax({
  monthNumber,
  cumulativeGrossIncome,
  cumulativeTaxPaid,
  taxRates,
  personalAllowance,
  isScottish,
}: CumulativePayeOptions & {
  taxRates: EnglishTaxRates | ScottishTaxRates;
  personalAllowance?: number;
  isScottish: boolean;
}): EnglishIncomeTax | ScottishIncomeTax {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error('monthNumber must be between 1 and 12');
  }

  if (isScottish) {
    return calculateScottishCumulativePayeTaxes({
      taxRates: taxRates as ScottishTaxRates,
      cumulativeGrossIncome,
      monthNumber,
      cumulativeTaxPaid,
      personalAllowance,
    });
  } else {
    return calculateEnglishCumulativePayeTaxes({
      taxRates: taxRates as EnglishTaxRates,
      cumulativeGrossIncome,
      monthNumber,
      cumulativeTaxPaid,
      personalAllowance,
    });
  }
}

export function validateRequiredFields(
  taxableAnnualIncome?: number,
  personalAllowance?: number,
): void {
  if (taxableAnnualIncome === undefined || personalAllowance === undefined) {
    throw new Error(
      'taxableAnnualIncome and personalAllowance are required when not using cumulativePaye mode',
    );
  }
}

export function calculateStandardTax({
  taxRates,
  taxableAnnualIncome,
  personalAllowance,
  isScottish,
}: {
  taxRates: EnglishTaxRates | ScottishTaxRates;
  taxableAnnualIncome: number;
  personalAllowance: number;
  isScottish: boolean;
}): EnglishIncomeTax | ScottishIncomeTax {
  return isScottish
    ? calculateScottishTaxes({
        taxRates: taxRates as ScottishTaxRates,
        taxableAnnualIncome,
        personalAllowance,
      })
    : calculateEnglishTaxes({
        taxRates: taxRates as EnglishTaxRates,
        taxableAnnualIncome,
        personalAllowance,
      });
}
