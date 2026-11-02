/**
 * Calculates the future value of a pension pot when it is left untouched for a certain number of years.
 * @param pot - The initial amount in the pension pot.
 * @param contribution - The monthly contribution to the pension pot.
 * @returns An array of future values of the pension pot for each year.
 */
export function leavePotUntouchedCalculator(
  pot: number,
  contribution: number,
): number[] {
  const INTEREST_RATE = 0.03;
  const YEARS = [1, 2, 3, 4, 5];

  /**
   * Calculates the annual contribution to the pension pot.
   * @returns The annual contribution amount.
   */
  function annualContribution(): number {
    return contribution * 12;
  }

  /**
   * Estimates the future value of the pension pot for each year.
   * @returns An array of future values of the pension pot for each year.
   */
  function estimate(): number[] {
    return YEARS.map((year) =>
      futureValue(pot, annualContribution(), INTEREST_RATE, year),
    );
  }

  return estimate();
}

/**
 * Calculates the future value of an investment using compound interest.
 * @param principalAmount - The initial amount of the investment.
 * @param additionalAmount - The additional amount invested periodically.
 * @param nominalInterestRate - The nominal interest rate per period.
 * @param periods - The number of periods the investment is held for.
 * @returns The future value of the investment.
 */
function futureValue(
  principalAmount: number,
  additionalAmount: number,
  nominalInterestRate: number,
  periods: number,
): number {
  const futureValueOfPrincipal =
    principalAmount * Math.pow(1 + nominalInterestRate, periods);
  const futureValueOfAdditional =
    additionalAmount *
    ((Math.pow(1 + nominalInterestRate, periods) - 1) / nominalInterestRate);
  return Number((futureValueOfPrincipal + futureValueOfAdditional).toFixed(0));
}
