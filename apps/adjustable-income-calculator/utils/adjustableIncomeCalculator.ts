/**
 *
 * @param pot - The total amount of money in the pension pot
 * @param age - The age the user wants to start drawing down the pension
 * @param desiredIncome - The desired income the user wants to draw down from the pension pot
 * @returns
 *  - The amount of money the user can withdraw from the pension pot tax free
 *  - The amount of money the user can withdraw from the pension pot that is taxable
 *  - The growth interest rate of the pension pot
 *  - The calculated or the desired amount of money the user can withdraw from the pension pot per month
 *  - The age the user can withdraw money from the pension pot until
 *  - The amount of money the user can withdraw from the pension pot per month until life expectancy
 *  - The life expectancy of the user
 */

export function adjustableIncomeCalculator(
  pot: number,
  age = 0,
  desiredIncome = 0,
) {
  const lifeExpectancy = 85;
  const taxFreePotPortion = 0.25;
  const growthInterestRate = 0.03;
  const amountToReduceLifetimePaymentBy = 100;
  const incomeLastsUntilAgeCap = 120;

  /**
   *
   * @returns The amount of money the user can withdraw from the pension pot per year
   * @description This function calculates the amount of money the user can withdraw from the pension pot per year
   */
  function getDesiredIncome(): number {
    return desiredIncome * 12;
  }

  /**
   * @returns Either the desired income or the amount of money the user can withdraw from the pension pot until life expectancy
   */
  function normalisedDrawdownAmount() {
    const desiredIncome = getDesiredIncome();
    return desiredIncome > 0 ? desiredIncome : incomeUntilLifeExpectancy();
  }

  /**
   * @returns The value of normalisedDrawdownAmount, per month, rounded down to the nearest whole number, and clamped to a minimum of 0
   */
  function monthlyDrawdownAmount(): number {
    return Math.max(0, Math.floor(normalisedDrawdownAmount() / 12));
  }

  /**
   *
   * @returns The amount of money the user can withdraw from the pension pot tax free
   */
  function taxFreeLumpSum(): number {
    return Math.round(pot * taxFreePotPortion);
  }

  /**
   *
   * @returns The amount of money the user can withdraw from the pension pot that is taxable
   */
  function taxablePortion(): number {
    return pot - taxFreeLumpSum();
  }

  /**
   *
   * @param yearlyDrawdown - The amount of money the user can withdraw from the pension pot per year
   * @returns  The age the user can withdraw money from the pension pot until
   */
  function desiredIncomeWithPotGrowthLastsUntil(
    yearlyDrawdown = normalisedDrawdownAmount(),
  ): number {
    let potRemaining = taxablePortion();
    let yearsLasted = 0;

    while (potRemaining > 0) {
      potRemaining *= growthInterestRate + 1;
      potRemaining -= yearlyDrawdown;

      if (potRemaining > 0) {
        yearsLasted++;
      }

      if (age + yearsLasted >= incomeLastsUntilAgeCap) {
        break;
      }
    }

    return age + yearsLasted;
  }

  /**
   * @returns The value of desiredIncomeWithPotGrowthLastsUntil, rounded down to the nearest whole number
   */
  function normalisedDesiredIncomeWithPotGrowthLastsUntil(): number {
    return Math.floor(desiredIncomeWithPotGrowthLastsUntil());
  }

  /**
   *
   * @returns The amount of money the user can withdraw from the pension pot per year until life expectancy
   */
  function incomeUntilLifeExpectancy(): number {
    const desiredIncome = getDesiredIncome();
    let yearlyWithdrawalUntilDeath = desiredIncome;

    if (yearlyWithdrawalUntilDeath <= 0) {
      yearlyWithdrawalUntilDeath = pot;
    }

    while (
      desiredIncomeWithPotGrowthLastsUntil(yearlyWithdrawalUntilDeath) <
      lifeExpectancy
    ) {
      yearlyWithdrawalUntilDeath -= amountToReduceLifetimePaymentBy;

      if (yearlyWithdrawalUntilDeath <= 1) {
        break;
      }
    }

    return yearlyWithdrawalUntilDeath;
  }

  /**
   *
   * @returns The amount of money the user can withdraw from the pension pot per month until life expectancy
   */
  function monthlyIncomeUntilLifeExpectancy(): number {
    return incomeUntilLifeExpectancy() / 12;
  }

  /**
   * @returns The value of monthlyIncomeUntilLifeExpectancy, rounded down to the nearest whole number, and clamped to a minimum of 0
   */
  function normalisedMonthlyIncomeUntilLifeExpectancy(): number {
    return Math.max(0, Math.floor(monthlyIncomeUntilLifeExpectancy()));
  }

  /**
   * @returns The growth interest rate of the pension pot, as a whole number percentage (i.e. 0%–100% instead of 0.00–1.00)
   */
  function growthInterestRateAsWholePercent(): number {
    return growthInterestRate * 100;
  }

  return {
    taxFreeLumpSum: taxFreeLumpSum(),
    taxablePortion: taxablePortion(),
    growthInterestRate: growthInterestRateAsWholePercent(),
    monthlyDrawdownAmount: monthlyDrawdownAmount(),
    desiredIncomeWithPotGrowthLastsUntil:
      normalisedDesiredIncomeWithPotGrowthLastsUntil(),
    monthlyIncomeUntilLifeExpectancy:
      normalisedMonthlyIncomeUntilLifeExpectancy(),
    lifeExpectancy,
  };
}
