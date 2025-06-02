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

  function getDesiredIncome(): number {
    return desiredIncome * 12;
  }

  function normalisedDrawdownAmount() {
    const desiredIncome = getDesiredIncome();
    return desiredIncome > 0 ? desiredIncome : incomeUntilLifeExpectancy();
  }

  function taxFreeLumpSum(): number {
    return Math.round(pot * taxFreePotPortion);
  }

  function taxablePortion(): number {
    return pot - taxFreeLumpSum();
  }

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

  function monthlyIncomeUntilLifeExpectancy(): number {
    return incomeUntilLifeExpectancy() / 12;
  }

  return {
    taxFreeLumpSum: taxFreeLumpSum(),
    taxablePortion: taxablePortion(),
    growthInterestRate: growthInterestRate * 100,
    monthlyDrawdownAmount: Math.floor(normalisedDrawdownAmount() / 12),
    desiredIncomeWithPotGrowthLastsUntil: Math.floor(
      desiredIncomeWithPotGrowthLastsUntil(),
    ),
    monthlyIncomeUntilLifeExpectancy: Math.floor(
      monthlyIncomeUntilLifeExpectancy(),
    ),
    lifeExpectancy: lifeExpectancy,
  };
}
