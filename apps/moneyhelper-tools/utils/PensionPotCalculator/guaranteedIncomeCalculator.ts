enum POT_PORTION {
  TAXABLE = 0.75,
  TAX_FREE = 0.25,
}

enum ANNUNITY_RATE {
  AGE_60 = 0.06065,
  AGE_65 = 0.06479,
  AGE_70 = 0.07205,
  AGE_75 = 0.08056,
  DEFAULT = 0.09398,
}

enum ANNUNITY_AGE {
  AGE_60 = 60,
  AGE_65 = 65,
  AGE_70 = 70,
  AGE_75 = 75,
}

/**
 * Calculate the guaranteed income and tax-free lump sum from a pension pot
 * @param pot - The pension pot amount
 * @param age - The age of the person
 * @returns The guaranteed income and tax-free lump sum
 */

export function guaranteedIncomeCalculator(
  pot: number,
  age: number,
): { income: number; taxFreeLumpSum: number } {
  function taxFreeLumpSum(): number {
    return Math.round(pot * POT_PORTION.TAX_FREE);
  }

  function income(): number {
    return taxableAmount() * annuityRate();
  }

  function incomeRounded(): number {
    return Math.round(income() / 100) * 100;
  }

  function taxableAmount(): number {
    return pot * POT_PORTION.TAXABLE;
  }

  function annuityRate(): number {
    switch (true) {
      case age < ANNUNITY_AGE.AGE_60:
        return ANNUNITY_RATE.AGE_60;
      case age >= ANNUNITY_AGE.AGE_60 && age < ANNUNITY_AGE.AGE_65:
        return ANNUNITY_RATE.AGE_65;
      case age >= ANNUNITY_AGE.AGE_65 && age < ANNUNITY_AGE.AGE_70:
        return ANNUNITY_RATE.AGE_70;
      case age >= ANNUNITY_AGE.AGE_70 && age < ANNUNITY_AGE.AGE_75:
        return ANNUNITY_RATE.AGE_75;
      default:
        return ANNUNITY_RATE.DEFAULT;
    }
  }

  return {
    income: incomeRounded(),
    taxFreeLumpSum: taxFreeLumpSum(),
  };
}
