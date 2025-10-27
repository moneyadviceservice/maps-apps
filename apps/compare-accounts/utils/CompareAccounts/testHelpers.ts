import { DineroSnapshot } from 'dinero.js';

import { Account } from './hydrateAccountFromJson';

export const baseAccountTemplate: Partial<Account> = {
  transactionFee: null,
  debitEU50Cost: null,
  debitWorld50Cost: null,
  atmMaxFreeWithdrawalUK: null,
  atmWithdrawalCharge: null,
  atmEU50Cost: null,
  atmWorld50Cost: null,
  directDebitCharge: null,
  standingOrderCharge: null,
  bacsCharge: null,
  fasterPaymentsCharge: null,
  chapsCharge: null,
  payOutEUMinChrg: null,
  payOutEUMaxChrg: null,
  payOutWorldMinChrg: null,
  payOutWorldMaxChrg: null,
  payInEUMinChrg: null,
  payInEUMaxChrg: null,
  payInWorldMinChrg: null,
  payInWorldMaxChrg: null,
  stoppedChequeCharge: null,
  arrangedODExample1: null,
  arrangedODExample2: null,
  debitCardIssueFee: null,
  debitCardReplacementFee: null,
  monthlyChargeBrochure: null,
  minimumMonthlyCreditBrochure: null,
  otherChargesBrochure: null,
  intPaymentsInDetail: null,
  intPaymentsOutDetail: null,
  intCashWithdrawDetail: null,
  ukCashWithdrawalDetail: null,
  intDebitCardPayDetail: null,
  transactionFeeBrochure: null,
  debitCardReplacementFeeBrochure: null,
  unpaidItemDetail: null,
  paidItemDetail: null,
  unarrangedODDetailBrochure: null,
  arrangedODDetailBrochure: null,
  unauthorisedOverdraftEar: null,
  atmWithdrawalChargePercent: null,
};

export const createCurrencyAmount = (
  amount: number,
): DineroSnapshot<number> => ({
  amount,
  currency: { code: 'GBP', base: 10, exponent: 2 },
  scale: 2,
});

export const createTestAccount = (overrides: Partial<Account>): Account => {
  return {
    ...baseAccountTemplate,
    id: '1',
    name: 'Test Account',
    providerName: 'Test Bank',
    url: 'https://example.com/test',
    type: 'basic',
    features: [],
    access: [],
    monthlyFee: null,
    minimumMonthlyCredit: null,
    unauthODMonthlyCap: null,
    overdraftFacility: true,
    representativeAPR: 19.9,
    ...overrides,
  } as Account;
};
