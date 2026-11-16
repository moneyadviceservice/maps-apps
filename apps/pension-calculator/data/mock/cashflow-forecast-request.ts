export const mockCashflowForecastRequest = {
  user: {
    dateOfBirth: '1965-01-01',
    gender: 'MALE',
    stateBenefit: {
      include: true,
      amount: 12014,
    },
  },
  assets: [
    {
      id: 'PENSIONS_1',
      typeReference: 'PersonalPension',
      funds: [
        {
          code: 'asset_class_cash',
          contributionPercentage: 100,
          balance: 150000,
        },
      ],
      drawdownOrder: 1,
      savingsOrder: 1,
      lumpSum: {
        percentage: 25,
        lumpSumAction: 'SPEND',
        dateEventId: 'retirementEvent',
      },
      annualCharges: {
        tieredCharges: [
          {
            percentage: 0.75,
          },
        ],
      },
      owner: 'MAIN',
    },
  ],
  events: [
    {
      id: 'retirementEvent',
      eventDate: '2030-01-01',
    },
  ],
  expenses: [
    {
      id: 'EXPENSE_1',
      value: 1500,
      frequency: 'MONTHLY',
      owner: 'MAIN',
      startEventId: 'retirementEvent',
      increase: {
        basis: 'CPI',
      },
    },
  ],
  forecastOptions: {
    terms: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    todaysPrices: true,
    todaysPricesIndex: 'CPI',
    percentiles: [50],
    taxBasis: 'NET',
    taxOptions: {
      region: 'UK',
      applyLtaTax: true,
    },
    investSurplus: false,
    chanceMetExpenses: false,
    expenseMetProportion: false,
    returnDetailedResults: false,
  },
};
