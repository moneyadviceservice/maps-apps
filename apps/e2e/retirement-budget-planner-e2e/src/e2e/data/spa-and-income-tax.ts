export const spaLessThanCurrentAge = {
  aboutYou: { day: '1', month: '1', year: '1980', retireAge: '60' },
  income: {
    pensionValue: '3000',
  },
  cost: {
    mortgageRepayment: '500',
  },
  expected:
    'From your State Pension age of 68, your retirement income could be £2,610 a month after tax.',
};

export const spaGreaterThanCurrentAge = {
  aboutYou: { day: '1', month: '1', year: '1955', retireAge: '75' },
  income: {
    pensionValue: '10000',
  },
  cost: {
    mortgageRepayment: '1500',
  },
  expected: 'Your retirement income could be £6,714 a month after tax.',
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
    'From your State Pension age of 67, your retirement income could be £9,400 a month after tax.',
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
    'From your State Pension age of 66 years and 10 months, your retirement income could be £3,010 a month after tax.',
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
    'From your State Pension age of 66, your retirement income could be £3,410 a month after tax.',
};

export const taxRatesDisclaimer =
  'This is based on the current Income Tax rates for England, Wales and Northern Ireland. You can see the Scottish Income Tax rates (opens in a new window)  on GOV.UK.\n Find out more in our guides about tax and pensions (opens in a new window) .';
