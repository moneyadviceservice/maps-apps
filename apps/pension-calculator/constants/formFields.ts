// Static object paths
export const FORM_FIELDS = {
  USER: {
    DATE_OF_BIRTH: 'user.dateOfBirth',
    GENDER: 'user.gender',
    STATE_BENEFIT_INCLUDE: 'user.stateBenefit.include',
    STATE_BENEFIT_AMOUNT: 'user.stateBenefit.amount',
  },
  FORECAST_OPTIONS: {
    TODAYS_PRICES: 'forecastOptions.todaysPrices',
    TODAYS_PRICES_INDEX: 'forecastOptions.todaysPricesIndex',
    TAX_BASIS: 'forecastOptions.taxBasis',
    TAX_REGION: 'forecastOptions.taxOptions.region',
    APPLY_LTA_TAX: 'forecastOptions.taxOptions.applyLtaTax',
    INVEST_SURPLUS: 'forecastOptions.investSurplus',
  },
} as const;

// Dynamic helpers for array items
export const ARRAY_FIELDS = {
  ASSET: (index: number) => ({
    ID: `assets.${index}.id`,
    TYPE: `assets.${index}.typeReference`,
    DRAWDOWN_ORDER: `assets.${index}.drawdownOrder`,
    SAVINGS_ORDER: `assets.${index}.savingsOrder`,
    OWNER: `assets.${index}.owner`,
    LUMP_SUM_PERCENTAGE: `assets.${index}.lumpSum.percentage`,
    LUMP_SUM_ACTION: `assets.${index}.lumpSum.lumpSumAction`,
    LUMP_SUM_EVENT_ID: `assets.${index}.lumpSum.dateEventId`,
    FUND_BALANCE: (fundIdx: number) =>
      `assets.${index}.funds.${fundIdx}.balance`,
    FUND_CODE: (fundIdx: number) => `assets.${index}.funds.${fundIdx}.code`,
  }),
  EXPENSE: (index: number) => ({
    ID: `expenses.${index}.id`,
    VALUE: `expenses.${index}.value`,
    FREQUENCY: `expenses.${index}.frequency`,
    OWNER: `expenses.${index}.owner`,
    START_EVENT_ID: `expenses.${index}.startEventId`,
    INCREASE_BASIS: `expenses.${index}.increase.basis`,
  }),
  EVENT: (index: number) => ({
    ID: `events.${index}.id`,
    DATE: `events.${index}.eventDate`,
  }),
} as const;
