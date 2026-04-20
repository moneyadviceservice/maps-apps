const aboutYou = {
  day: '1',
  month: '1',
  year: '1980',
  retireAge: '60',
  gender: 'female',
};
const income = {
  pensionValue: '1000',
  statePensionValue: '1000',
};
const cost = {
  mortgageRepayment: '500',
};
export const moneyLeftOver = {
  aboutYou: aboutYou,
  income: {
    pensionValue: '3000',
  },
  cost: cost,
  expected: {
    title: 'You should have money left over',
    paragraph1:
      'Your costs are lower than your estimated retirement income, so you should have money left over.',
    paragraph2:
      'The Retirement Living Standards can give you an idea of the lifestyle you might be able to afford.',
  },
};

export const incomeLessThanCosts = {
  aboutYou: aboutYou,
  income: {
    pensionValue: '1000',
  },
  cost: {
    mortgageRepayment: '1500',
  },
  expected: {
    title: 'Your estimated retirement income is unlikely to cover your costs',
    paragraph1:
      'Your costs are higher than the retirement income you’re estimated to receive.',
    paragraph2:
      'For help, see our guides about benefits in retirement and ways to boost your pension.',
  },
};
export const maleLifeExpectancy = {
  aboutYou: { ...aboutYou, gender: 'male' },
  income: {
    pensionValue: '1000',
  },
  cost: cost,
  expected: {
    title: 'Your retirement income might need to last for over 24 years',
    paragraph1:
      'Based on average life expectancies, you’ll likely need to budget to make sure your retirement income lasts until you’re at least 84.',
    paragraph2:
      'This means you should be careful not to run out of money too soon. You can use the Office for National Statistics life expectancy calculator to find out the average life expectancy for someone of your age and sex.',
  },
};
export const femaleLifeExpectancy = {
  aboutYou: {
    ...aboutYou,
  },
  income: {
    pensionValue: '1000',
  },
  cost: cost,
  expected: {
    title: 'Your retirement income might need to last for over 27 years',
    paragraph1:
      'Based on average life expectancies, you’ll likely need to budget to make sure your retirement income lasts until you’re at least 87.',
    paragraph2:
      'This means you should be careful not to run out of money too soon. You can use the Office for National Statistics life expectancy calculator to find out the average life expectancy for someone of your age and sex.',
  },
};

export const maleLifeExpectancyWithRetireAge84 = {
  aboutYou: {
    ...aboutYou,
    retireAge: '84',
    gender: 'male',
  },
  income: {
    pensionValue: '1000',
  },
  cost: cost,
};
export const femaleLifeExpectancyWithRetireAge87 = {
  aboutYou: {
    ...aboutYou,
    retireAge: '87',
  },
  income: {
    pensionValue: '1000',
  },
  cost: cost,
};

export const retireBeforeStatePensionAge = {
  aboutYou: {
    ...aboutYou,
    retireAge: '55',
  },
  income: income,
  cost: cost,
  expected: {
    title: 'You plan to retire before you can claim the State Pension',
    paragraph1:
      'You’ll reach your State Pension age after your planned retirement date. This means you:',
  },
};

export const repayMortgageInRetirement = {
  aboutYou: aboutYou,
  income: income,
  cost: cost,
  expected: {
    title: 'Consider how you’ll repay your mortgage in retirement',
    paragraph1:
      'There are often fewer mortgage options after you retire, so it’s a good idea to repay your mortgage as early as you can afford to. If you have an interest-only mortgage, your lender or a financial adviser can help you plan how to repay the borrowed amount.',
  },
};

export const genderPayGap = {
  aboutYou: aboutYou,
  income: income,
  cost: cost,
  expected: {
    title: 'Check if you’re affected by the gender pensions gaps',
    paragraph1:
      'Many women retire with up to half as much retirement savings as men, often due to caring responsibilities and working lower paid jobs.',
  },
};

export const reduceBorrowingAfterRetirementWithCreditCard = {
  aboutYou: aboutYou,
  income: income,
  cost: { ...cost, creditCardRepayment: '500' },
  expected: {
    title: 'Plan to reduce your borrowing after you retire',
    paragraph1:
      'If you currently use credit cards or loans to pay for things, you might find you cannot borrow as much after you retire. This means you might need to budget to use your income instead, in addition to repaying the debt.',
  },
};
export const reduceBorrowingAfterRetirementWithLoan = {
  aboutYou: aboutYou,
  income: income,
  cost: { ...cost, loanRepayment: '500' },
  expected: {
    title: 'Plan to reduce your borrowing after you retire',
    paragraph1:
      'If you currently use credit cards or loans to pay for things, you might find you cannot borrow as much after you retire. This means you might need to budget to use your income instead, in addition to repaying the debt.',
  },
};

export const qualifyForSocialHousingInRetirement = {
  aboutYou: aboutYou,
  income: income,
  cost: { rentOrCareHomeFee: '500' },
  expected: {
    title: 'Check if you qualify for social housing in retirement',
    paragraph1:
      'If you’re planning on renting after you retire, make sure to budget for potential rent increases and costs to adapt your home.',
  },
};

export const claimingBenefits = {
  aboutYou: aboutYou,
  income: {
    pensionValue: '3000',
    benefits: '500',
  },
  cost: cost,
  expected: {
    title: 'Check you’re claiming everything you’re entitled to',
    paragraph1: 'See all the help that’s available in our guide about',
    paragraph2:
      'to check if taking your pension will affect the benefits you currently receive.',
  },
};

export const boostStatePension = {
  aboutYou: aboutYou,
  income: {
    statePensionValue: '180',
    pensionValue: '3000',
  },
  cost: cost,
  expected: {
    title: 'Check if you can boost your State Pension',
    paragraph1:
      'You’re currently not on track to receive the full amount of State Pension, but there might be ways to increase the amount you get.',
    paragraph2:
      'For more information, see our guides about boosting your State Pension.',
  },
};

export const claimingEverythingEntitled = {
  aboutYou: aboutYou,
  income: {
    pensionValue: '180',
  },
  cost: cost,
  expected: {
    title: 'Check you’re claiming everything you’re entitled to',
    paragraph1: 'See all the help that’s available in our guide about',
    paragraph2:
      'to check if taking your pension will affect the benefits you currently receive.',
  },
};
