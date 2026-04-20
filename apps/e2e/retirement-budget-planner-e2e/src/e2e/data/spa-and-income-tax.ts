export const spaLessThanCurrentAge = {
  aboutYou: { day: '1', month: '1', year: '1980', retireAge: '60' },
  income: {
    pensionValue: '3000',
  },
  cost: {
    mortgageRepayment: '500',
  },
  expected:
    'From your State Pension Age of 68, your retirement income could be £31,314 a year after tax.',
};

export const spaGreaterThanCurrentAge = {
  aboutYou: { day: '1', month: '1', year: '1955', retireAge: '75' },
  income: {
    pensionValue: '10000',
  },
  cost: {
    mortgageRepayment: '1500',
  },
  expected: 'Your retirement income could be £84,568 a year after tax.',
};
export const additionalRateIncomeTax = {
  aboutYou: { day: '25', month: '3', year: '1975', retireAge: '68' },
  income: {
    pensionValue: '15000',
  },
  cost: {
    mortgageRepayment: '500',
  },
  expected:
    'From your State Pension Age of 67, your retirement income could be £117,825 a year after tax.',
};

export const spaDisplayWithYearsAndMonths = {
  aboutYou: { day: '1', month: '2', year: '1961', retireAge: '70' },
  income: {
    pensionValue: '3500',
  },
  cost: {
    mortgageRepayment: '500',
  },
  expected:
    'From your State Pension Age of 66 years and 10 months, your retirement income could be £36,114 a year after tax.',
};

/**
 * This data is used for validating the scenario when State Pension age is equal to Current age.
 * Date of birth is set in such a way that the calculated State Pension age is 66 which is equal to the current age based on the current date.
 * Thus test data will remain valid until 24th March 2026.
 * After that, the date of birth needs to be updated to keep the State Pension age equal to current age.
 */
export const spaEqualToCurrentAge = {
  aboutYou: { day: '24', month: '3', year: '1960', retireAge: '66' },
  income: {
    pensionValue: '4000',
  },
  cost: {
    mortgageRepayment: '500',
  },
  expected:
    'From your State Pension Age of 66, your retirement income could be £40,914 a year after tax.',
};

export const taxRatesDisclaimer =
  'This is based the current Income Tax rates for England, Wales and Northern Ireland. You can see the Scottish Income Tax rates on GOV.UK.\nFind out more in our guides tax and pensions.';

export const alreadyRetiredDisclaimer =
  'If you’ve already retired, our full Budget planner will give you a more detailed breakdown of your finances.';
