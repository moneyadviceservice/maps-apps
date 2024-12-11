import { getDurationOptions } from 'data/form-content/questions/savings-calculator';

import { useTranslation } from '@maps-react/hooks/useTranslation';

enum SavingsCalculatorDuration {
  MAX_MONTHS = 6000,
  MONTHS_PER_YEAR = 12,
}

enum SavingsCalculatorRateWarning {
  HIGH = 10,
  LOW = 3,
}

export enum SavingsCalculatorFrequency {
  YEAR = 1,
  MONTH = 12,
  WEEK = 52,
}

export interface SavingsCalculatorResultsData {
  savingGoal: number;
  regularDeposit: number;
  regularDepositFrequency: SavingsCalculatorFrequency;
  savingDate?: Date;
  initialDeposit: number;
  annualRate?: number;
}

export interface SavingsResults {
  savingGoal: number;
  regularDepositFrequency: SavingsCalculatorFrequency;
  monthsToGoal: {
    duration: { years: number; months: number };
    regularDeposit: number;
    totalSaved: number;
  };
  altMonthsToGoal: {
    duration: { years: number; months: number };
    regularDeposit: number;
    regularDepositIncrease: number;
    difference: { years: number; months: number };
  };
}

export const savingsCalculatorResults = ({
  savingGoal,
  regularDeposit,
  regularDepositFrequency,
  savingDate,
  initialDeposit,
  annualRate = 0,
}: SavingsCalculatorResultsData): SavingsResults => {
  if (savingDate) {
    regularDeposit = regularDepositRequired(savingDate);
    regularDepositFrequency = SavingsCalculatorFrequency.MONTH;
  }

  const months = monthsToGoal();
  const altMonths = altMonthsToGoal(months);

  function toMonthlyValue(
    value: number,
    regularDepositFrequency: SavingsCalculatorFrequency,
  ): number {
    if (regularDepositFrequency === SavingsCalculatorFrequency.MONTH) {
      return value * 1.0;
    } else if (regularDepositFrequency === SavingsCalculatorFrequency.WEEK) {
      return (value * 52) / 12.0;
    } else if (regularDepositFrequency === SavingsCalculatorFrequency.YEAR) {
      return value / 12.0;
    } else {
      throw new Error(
        `Unsupported regularDepositFrequency: ${regularDepositFrequency}`,
      );
    }
  }

  function convertMonthsToYearAndMonths(months: number) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return { years, months: remainingMonths };
  }

  function monthlyInterestRate(annualRate: number): number {
    if (annualRate === 0) {
      return 1.0;
    }

    return Math.pow(1.0 + annualRate / 100.0, 1 / 12.0);
  }

  function monthsToGoal(newRegDeposit: number | undefined = undefined): number {
    if (initialDeposit >= savingGoal) {
      return 0;
    }

    let value: number = initialDeposit;
    const rate: number = monthlyInterestRate(annualRate);

    const monthlyDeposit: number = toMonthlyValue(
      newRegDeposit ?? regularDeposit,
      regularDepositFrequency,
    );

    if (regularDeposit === 0) {
      return SavingsCalculatorDuration.MAX_MONTHS;
    }

    for (
      let months = 0;
      ++months;
      months <= SavingsCalculatorDuration.MAX_MONTHS
    ) {
      value = value * rate + monthlyDeposit;
      if (value >= savingGoal) {
        return months;
      }
    }

    return SavingsCalculatorDuration.MAX_MONTHS;
  }

  function calculateReducedMonthsToGoal(currentMonthsToGoal: number): number {
    if (currentMonthsToGoal >= 4) {
      return Math.ceil((currentMonthsToGoal * 3) / 4);
    } else if (currentMonthsToGoal >= 2) {
      return currentMonthsToGoal - 1;
    } else {
      return 0;
    }
  }

  function altMonthsToGoal(currentMonthsToGoal: number): {
    newRegDeposit: number;
    newMonthsToGoal: number;
  } {
    const reducedMonthsToGoal: number =
      calculateReducedMonthsToGoal(currentMonthsToGoal);

    if (reducedMonthsToGoal <= 0) {
      return {
        newRegDeposit: 0,
        newMonthsToGoal: 0,
      };
    }

    const newMonthlyRegDeposit: number = regularDepositRequired(
      new Date(
        new Date().setMonth(new Date().getMonth() + reducedMonthsToGoal),
      ),
    );

    const newRegDeposit: number = fromMonthlyValue(
      newMonthlyRegDeposit,
      regularDepositFrequency,
    );

    const newMonthsToGoal: number = monthsToGoal(newRegDeposit);

    return {
      newRegDeposit,
      newMonthsToGoal,
    };
  }

  function regularDepositRequired(savingsDate: Date): number {
    const numberOfMonths: number = monthsBetween(new Date(), savingsDate);

    const initialDepositAtSavingsDate: number = applySimpleInterest(
      initialDeposit,
      monthlyInterestRate(annualRate),
      numberOfMonths,
    );

    if (initialDepositAtSavingsDate >= savingGoal) {
      return 0;
    } else {
      const subGoal: number = savingGoal - initialDepositAtSavingsDate;
      const interestMultiplier: number = regularDepositInterestMultiplier(
        monthlyInterestRate(annualRate),
        numberOfMonths,
      );

      return Math.ceil(Math.max(subGoal / interestMultiplier));
    }
  }

  function regularDepositInterestMultiplier(
    periodicInterestRate: number,
    numberOfPeriods: number,
  ): number {
    if (periodicInterestRate > 1.0) {
      return (
        (Math.pow(periodicInterestRate, numberOfPeriods) - 1.0) /
        (periodicInterestRate - 1.0)
      );
    } else {
      return numberOfPeriods;
    }
  }

  function applySimpleInterest(
    amount: number,
    periodicRate: number,
    numberOfPeriods: number,
  ): number {
    return amount * Math.pow(periodicRate, numberOfPeriods);
  }

  function monthsBetween(startDate: Date, endDate: Date) {
    const yearsDifference = endDate.getFullYear() - startDate.getFullYear();
    const monthsDifference = endDate.getMonth() - startDate.getMonth();
    const daysDifference = endDate.getDate() - startDate.getDate();

    let monthCorrection = 0;
    if (daysDifference > 0) {
      monthCorrection = 1;
    } else if (daysDifference < 0) {
      monthCorrection = -1;
    }

    return 1 * (yearsDifference * 12 + monthsDifference + monthCorrection);
  }

  function fromMonthlyValue(
    monthlyValue: number,
    regularDepositFrequency: SavingsCalculatorFrequency,
  ): number {
    if (regularDepositFrequency === SavingsCalculatorFrequency.YEAR) {
      return monthlyValue * 12;
    } else if (regularDepositFrequency === SavingsCalculatorFrequency.WEEK) {
      return Math.ceil((monthlyValue * 12) / 52);
    } else if (regularDepositFrequency === SavingsCalculatorFrequency.MONTH) {
      return monthlyValue;
    } else {
      throw new Error(
        `Unsupported regularDepositFrequency: ${regularDepositFrequency}`,
      );
    }
  }

  function getDurationDifference(
    monthsToGoalDuration: { years: number; months: number },
    altMonthsToGoalDuration: { years: number; months: number },
  ): { years: number; months: number } {
    let years = monthsToGoalDuration.years - altMonthsToGoalDuration.years;
    let months = monthsToGoalDuration.months - altMonthsToGoalDuration.months;

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  }

  const monthsToGoalDuration = convertMonthsToYearAndMonths(months);
  const altMonthsToGoalDuration = convertMonthsToYearAndMonths(
    altMonths.newMonthsToGoal,
  );

  const getTotalSaved = ({
    years,
    months,
  }: {
    years: number;
    months: number;
  }): number => {
    return initialDeposit + regularDeposit * (months + years * 12);
  };

  return {
    savingGoal: savingGoal,
    regularDepositFrequency: regularDepositFrequency,
    monthsToGoal: {
      duration: monthsToGoalDuration,
      regularDeposit: regularDeposit,
      totalSaved: getTotalSaved(monthsToGoalDuration),
    },
    altMonthsToGoal: {
      duration: altMonthsToGoalDuration,
      regularDeposit: altMonths.newRegDeposit,
      regularDepositIncrease: Math.max(
        0,
        altMonths.newRegDeposit - regularDeposit,
      ),
      difference: getDurationDifference(
        monthsToGoalDuration,
        altMonthsToGoalDuration,
      ),
    },
  };
};

export const interestRateWarning = (
  annualRate: number,
): {
  annualInterestRateHigh: boolean;
  annualInterestRateLow: boolean;
} => {
  return {
    annualInterestRateHigh: annualRate > SavingsCalculatorRateWarning.HIGH,
    annualInterestRateLow: annualRate < SavingsCalculatorRateWarning.LOW,
  };
};

export const getSavingDuration = (
  z: ReturnType<typeof useTranslation>['z'],
  duration: number,
) => {
  const durations = getDurationOptions(z);
  return durations
    .find((d) => d.value === duration.toString())
    ?.text?.toString()
    ?.split(' ')[1];
};
