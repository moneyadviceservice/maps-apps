enum PERSONAL_ALLOWANCE {
  STANDARD = 12570,
  BASIC = 37700,
  HIGHER = 125140,
}

enum TAX_FREE_ALLOWANCE {
  DEFAULT = 0.75,
}

enum TAX_RATE {
  BASIC = 0.2,
  HIGHER = 0.4,
  ADDITIONAL = 0.45,
}

enum PERSONAL_ALLOWANCE_REDUCTION_THRESHOLD {
  DEFAULT = 100000,
}

export interface PensionPotTaxChunkResults {
  amount: number;
  taxDue: number;
  remainingPot: number;
}

export function pensionPotChunkTax(
  income: number,
  potAmount: number,
  chunk: number,
): PensionPotTaxChunkResults {
  const tax = calculateTaxChunk(chunk, income);

  const lumpSumTax = Object.values(tax).reduce((sum, value) => sum + value, 0);
  const lumpSumReceived = chunk - lumpSumTax;

  return {
    amount: Math.round(lumpSumReceived),
    taxDue: Math.round(lumpSumTax),
    remainingPot: potAmount - chunk,
  };
}

function calculateTaxChunk(lumpSum: number, income: number) {
  const potentiallyTaxableLumpSum = lumpSum * TAX_FREE_ALLOWANCE.DEFAULT;
  const allowance = personalAllowance(potentiallyTaxableLumpSum + income);

  // adjust bands according to income
  const incomeAboveAllowance = Math.max(income - allowance, 0);
  const effectiveAllowance = Math.max(allowance - income, 0);
  const effectiveBasicRateUpperLimit = Math.max(
    PERSONAL_ALLOWANCE.BASIC - incomeAboveAllowance,
    0,
  );
  const effectiveHigherRateUpperLimit = Math.max(
    PERSONAL_ALLOWANCE.HIGHER - incomeAboveAllowance,
    0,
  );

  // personal allowance
  let remainingTaxableLumpSum = 0;
  if (potentiallyTaxableLumpSum > effectiveAllowance) {
    remainingTaxableLumpSum = Math.max(
      potentiallyTaxableLumpSum - effectiveAllowance,
      0,
    );
  }

  // basic rate
  const subjectToBasicRate = Math.min(
    remainingTaxableLumpSum,
    effectiveBasicRateUpperLimit,
  );
  remainingTaxableLumpSum -= subjectToBasicRate;

  // higher rate
  const subjectToHigherRate = Math.min(
    remainingTaxableLumpSum,
    effectiveHigherRateUpperLimit - effectiveBasicRateUpperLimit,
  );
  remainingTaxableLumpSum -= subjectToHigherRate;

  // additional rate
  const subjectToAdditionalRate = remainingTaxableLumpSum;

  return {
    basic: subjectToBasicRate * TAX_RATE.BASIC,
    higher: subjectToHigherRate * TAX_RATE.HIGHER,
    additional: subjectToAdditionalRate * TAX_RATE.ADDITIONAL,
  };
}

function personalAllowance(income: number) {
  if (income >= PERSONAL_ALLOWANCE_REDUCTION_THRESHOLD.DEFAULT) {
    const amountOverThreshold =
      income - PERSONAL_ALLOWANCE_REDUCTION_THRESHOLD.DEFAULT;
    const reduction = Math.min(
      amountOverThreshold / 2,
      PERSONAL_ALLOWANCE.STANDARD,
    );
    return PERSONAL_ALLOWANCE.STANDARD - reduction;
  }

  return PERSONAL_ALLOWANCE.STANDARD;
}
