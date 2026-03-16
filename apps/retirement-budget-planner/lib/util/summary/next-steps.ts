import { FIELD_NAMES } from 'data/essentialOutgoingsData';
import {
  INCOME_FIELDS,
  incomeDefaultFrequencies,
  prefix,
} from 'data/retirementIncomeData';
import {
  FREQUENCY_FACTOR_MAPPING,
  FREQUNCY_KEYS,
} from 'lib/constants/pageConstants';

import { sumFields } from '../summaryCalculations/calculations';
import {
  getCurrentAgeInYearsAndMonths,
  getStatePensionAge,
  parsePensionAge,
} from './state-pension-age';
const FULL_STATE_PENSION_AMOUNT = 11973,
  WEEKLY_PENSION_CREDIT_TOP_UP = 227.1,
  AVERAGE_LIFE_EXPECTANCY_MEN = 84,
  AVERAGE_LIFE_EXPECTANCY_WOMEN = 87;
function toAnnualAmount(amount: number, frequency: FREQUNCY_KEYS): number {
  const ANNUAL_FACTORS: Record<FREQUNCY_KEYS, number> = Object.fromEntries(
    FREQUENCY_FACTOR_MAPPING.map(({ key, value }) => [key, value * 12]),
  ) as Record<FREQUNCY_KEYS, number>;
  const factor = ANNUAL_FACTORS[frequency] ?? 0;
  return Number.isFinite(amount) ? amount * factor : 0;
}
const findRemainingYears = (retireAge: string, lifeExpectancy: number) =>
  Number(retireAge) >= lifeExpectancy ? 0 : lifeExpectancy - Number(retireAge);
function getRemainingLifeExpectancy(gender: string, retireAge: string): number {
  return gender === 'male'
    ? findRemainingYears(retireAge, AVERAGE_LIFE_EXPECTANCY_MEN)
    : findRemainingYears(retireAge, AVERAGE_LIFE_EXPECTANCY_WOMEN);
}
export const mapFrequencyToValue = (val: string) =>
  FREQUENCY_FACTOR_MAPPING.find((t) => t.key === val)?.value;
export const findDisplayBoostStatePension = (
  income: Record<string, string>,
  statePensionAge: string,
  dob: {
    day: string;
    month: string;
    year: string;
  },
) => {
  const currentAge = getCurrentAgeInYearsAndMonths(dob);
  const statePensionMoneyInputName = `${prefix}${INCOME_FIELDS.STATE}`;
  const statePensionFrequencyName = `${prefix}${INCOME_FIELDS.STATE}Frequency`;
  const statePension = income[`${statePensionMoneyInputName}`];
  const frequency: FREQUNCY_KEYS = income[
    statePensionFrequencyName
  ] as FREQUNCY_KEYS;

  const annualStatePensionAmount = toAnnualAmount(
    Number(statePension),
    frequency,
  );
  const displayBoostStatePension =
    annualStatePensionAmount < FULL_STATE_PENSION_AMOUNT &&
    currentAge &&
    currentAge < parsePensionAge(statePensionAge);
  return displayBoostStatePension;
};
export const getAnnualIncome = (income: Record<string, string>) => {
  const yearFactor = mapFrequencyToValue(FREQUNCY_KEYS.YEAR) ?? 1;
  return sumFields(income, incomeDefaultFrequencies, 'Frequency') / yearFactor;
};

export const hasentitelementsToAdditionalBenefits = (
  income: Record<string, string>,
) => {
  const benefitsMoneyInputName = `${prefix}${INCOME_FIELDS.BENEFITS}`;
  const benefitsAmount = income[`${benefitsMoneyInputName}`];
  const annualIncome = getAnnualIncome(income);

  const annualPensionCreditTopUp = WEEKLY_PENSION_CREDIT_TOP_UP * 52;

  const entitelementsToAdditionalBenefits =
    Number(benefitsAmount) > 0 || annualIncome < annualPensionCreditTopUp;

  return entitelementsToAdditionalBenefits;
};

export const getAllCostRelatedNextStepsFlags = (
  costs: Record<string, string>,
) => {
  const mortgageMoneyInputName = `${prefix}${FIELD_NAMES.MORTGAGE_REPAYMENT}`;
  const mortgageAmount = Number(costs[mortgageMoneyInputName]);
  const rentOrCareHomeMoneyInputName = `${prefix}${FIELD_NAMES.RENT}`;
  const rentOrCareHomeAmount = Number(costs[rentOrCareHomeMoneyInputName]);

  const creditCardMoneyInputName = `${prefix}${FIELD_NAMES.LOANS}`;
  const creditCardAmount = Number(costs[creditCardMoneyInputName]);
  const loanMoneyInputName = `${prefix}${FIELD_NAMES.BUY_NOW_PAY_LATER}`;
  const loanAmount = Number(costs[loanMoneyInputName]);
  const unsecuredLoans = creditCardAmount || loanAmount;
  return [mortgageAmount, rentOrCareHomeAmount, unsecuredLoans];
};
export const getlifeExpectancyDetails = (
  retireAge: string,
  gender: string,
  t: (
    key: string,
    data?: Record<string, string> | undefined,
    fallback?: string,
  ) => string,
) => {
  const remainingLifeExpectancy: number = getRemainingLifeExpectancy(
    gender,
    retireAge,
  );
  const lifeExpectancyTitle: string = t(
    'summaryPage.retirementCallout.lifeExpectancy.title',
    { years: remainingLifeExpectancy.toString() },
  );

  const lifeExpectancyContent: string = t(
    'summaryPage.retirementCallout.lifeExpectancy.content',
    {
      age:
        gender === 'male'
          ? AVERAGE_LIFE_EXPECTANCY_MEN.toString()
          : AVERAGE_LIFE_EXPECTANCY_WOMEN.toString(),
    },
  );
  return {
    remainingLifeExpectancy,
    lifeExpectancyTitle,
    lifeExpectancyContent,
  };
};

export const shouldDisplayAgeHeading = (dob: {
  day: string;
  month: string;
  year: string;
}) => {
  const currentAge = getCurrentAgeInYearsAndMonths(dob);
  const statePensionAge = getStatePensionAge(dob);
  return currentAge && currentAge <= parsePensionAge(statePensionAge);
};
