import { GBP } from '@dinero.js/currencies';
import { dinero, DineroSnapshot, isZero } from 'dinero.js';
import numeral from 'numeral';

import { accountTypeLabelFromDefaqtoAccountType } from './account-mapping';

interface JsonObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type FeeType = DineroSnapshot<number> | string | null;

export interface Account {
  id: string;
  name: string;
  providerName: string;
  url: string;
  type: string;
  monthlyFee: FeeType;
  transactionFee: FeeType;
  debitEU50Cost: FeeType;
  debitWorld50Cost: FeeType;
  atmMaxFreeWithdrawalUK: FeeType;
  atmWithdrawalCharge: FeeType;
  atmEU50Cost: FeeType;
  atmWorld50Cost: FeeType;
  directDebitCharge: FeeType;
  standingOrderCharge: FeeType;
  bacsCharge: FeeType;
  fasterPaymentsCharge: FeeType;
  chapsCharge: FeeType;
  payOutEUMinChrg: FeeType;
  payOutEUMaxChrg: FeeType;
  payOutWorldMinChrg: FeeType;
  payOutWorldMaxChrg: FeeType;
  payInEUMinChrg: FeeType;
  payInEUMaxChrg: FeeType;
  payInWorldMinChrg: FeeType;
  payInWorldMaxChrg: FeeType;
  stoppedChequeCharge: FeeType;
  unauthODMonthlyCap: FeeType;
  minimumMonthlyCredit: FeeType;
  arrangedODExample1: FeeType;
  arrangedODExample2: FeeType;
  debitCardIssueFee: FeeType;
  debitCardReplacementFee: FeeType;
  monthlyChargeBrochure: string | null;
  minimumMonthlyCreditBrochure: string | null;
  otherChargesBrochure: string | null;
  intPaymentsInDetail: string | null;
  intPaymentsOutDetail: string | null;
  intCashWithdrawDetail: string | null;
  ukCashWithdrawalDetail: string | null;
  intDebitCardPayDetail: string | null;
  transactionFeeBrochure: string | null;
  debitCardReplacementFeeBrochure: string | null;
  unpaidItemDetail: string | null;
  paidItemDetail: string | null;
  unarrangedODDetailBrochure: string | null;
  arrangedODDetailBrochure: string | null;
  overdraftFacility: boolean;
  representativeAPR: number | null;
  unauthorisedOverdraftEar: number | null;
  atmWithdrawalChargePercent: number | null;
  features: string[];
  access: string[];
}

const hydrateAccountFromJson = (json: JsonObject): Account => {
  const retrieveUrl = (): string => {
    const prefix = 'https://';
    if (json.productLandingPageURL.indexOf(prefix) === 0) {
      return json.productLandingPageURL;
    } else {
      return [prefix, json.productLandingPageURL].join('');
    }
  };

  const retrieveMoneyField = (
    nameInDefaqtoAPI: string,
  ): DineroSnapshot<number> | string | null => {
    if (
      json[nameInDefaqtoAPI] === 'Infinity' ||
      json[nameInDefaqtoAPI] === ''
    ) {
      return null;
    }
    const float = numeral(json[nameInDefaqtoAPI]);
    const cents = Math.round(float.value()! * 100);
    return dinero({ amount: cents, currency: GBP }).toJSON();
  };

  const retrieveTextField = (nameInDefaqtoAPI: string): string | null => {
    const value = json[nameInDefaqtoAPI];
    const isEmpty =
      !value || ['0', '0.00', '0.00. <br /> ', '0 <br /> '].includes(value);

    if (!isEmpty) {
      return value
        .replaceAll('{P}', '')
        .replaceAll('<br/>', '')
        .replaceAll('<br />', '');
    }

    return null;
  };

  const retrieveNumberField = (name: string): number | null => {
    return numeral(json[name] || 0).value();
  };

  const retrieveAccess = (): string[] => {
    const results: string[] = [];
    const trueValue = true;

    if (json.branchBanking === trueValue) {
      results.push('branchBanking');
    }
    if (json.internetBanking === trueValue) {
      results.push('internetBanking');
    }
    if (json.mobilePhoneApp === trueValue) {
      results.push('mobileAppBanking');
    }
    if (json.postOfficeBanking === trueValue) {
      results.push('postOfficeBanking');
    }

    return results;
  };

  const retrieveFeatures = (): string[] => {
    const results: string[] = [];

    if (json.chequeBook === 'Yes') {
      results.push('chequeBookAvailable');
    }

    const monthlyCharge = retrieveMoneyField('monthlyCharge');
    if (
      !monthlyCharge ||
      (typeof monthlyCharge === 'object' && isZero(dinero(monthlyCharge)))
    ) {
      results.push('noMonthlyFee');
    }

    if (!json.existingCustomer) {
      results.push('openToNewCustomers');
    }

    if (json.overdraftFacility === true) {
      results.push('overdraftFacilities');
    }

    if (json.bacsSwitchService === true) {
      results.push('sevenDaySwitching');
    }

    return results;
  };

  return {
    id: json.id,
    name: json.productName,
    providerName: json.providerName,
    url: retrieveUrl(),
    type: accountTypeLabelFromDefaqtoAccountType(json.accountType),
    monthlyFee: retrieveMoneyField('monthlyCharge'),
    transactionFee: retrieveMoneyField('transactionFee'),
    debitEU50Cost: retrieveMoneyField('debitEU50Cost'),
    debitWorld50Cost: retrieveMoneyField('debitWorld50Cost'),
    atmMaxFreeWithdrawalUK: retrieveMoneyField('atmMaxFreeWithdrawalUK'),
    atmWithdrawalCharge: retrieveMoneyField('atmWithdrawalCharge'),
    atmEU50Cost: retrieveMoneyField('atmEU50Cost'),
    atmWorld50Cost: retrieveMoneyField('atmWorld50Cost'),
    directDebitCharge: retrieveMoneyField('directDebitCharge'),
    standingOrderCharge: retrieveMoneyField('standingOrderCharge'),
    bacsCharge: retrieveMoneyField('bacsCharge'),
    fasterPaymentsCharge: retrieveMoneyField('fasterPaymentsCharge'),
    chapsCharge: retrieveMoneyField('chapsCharge'),
    payOutEUMinChrg: retrieveMoneyField('payOutEUMinChrg'),
    payOutEUMaxChrg: retrieveMoneyField('payOutEUMaxChrg'),
    payOutWorldMinChrg: retrieveMoneyField('payOutWorldMinChrg'),
    payOutWorldMaxChrg: retrieveMoneyField('payOutWorldMaxChrg'),
    payInEUMinChrg: retrieveMoneyField('payInEUMinChrg'),
    payInEUMaxChrg: retrieveMoneyField('payInEUMaxChrg'),
    payInWorldMinChrg: retrieveMoneyField('payInWorldMinChrg'),
    payInWorldMaxChrg: retrieveMoneyField('payInWorldMaxChrg'),
    stoppedChequeCharge: retrieveMoneyField('stoppedChequeCharge'),
    unauthODMonthlyCap: retrieveMoneyField('unauthODMonthlyCap'),
    minimumMonthlyCredit: retrieveMoneyField('minimumMonthlyCredit'),
    arrangedODExample1: retrieveMoneyField('arrangedODExample1'),
    arrangedODExample2: retrieveMoneyField('arrangedODExample2'),
    debitCardIssueFee: retrieveMoneyField('debitCardIssueFee'),
    debitCardReplacementFee: retrieveMoneyField('debitCardReplacementFee'),
    monthlyChargeBrochure: retrieveTextField('monthlyChargeBrochure'),
    minimumMonthlyCreditBrochure: retrieveTextField(
      'minimumMonthlyCreditBrochure',
    ),
    otherChargesBrochure: retrieveTextField('otherChargesBrochure'),
    intPaymentsInDetail: retrieveTextField('intPaymentsInDetail'),
    intPaymentsOutDetail: retrieveTextField('intPaymentsOutDetail'),
    intCashWithdrawDetail: retrieveTextField('intCashWithdrawDetail'),
    ukCashWithdrawalDetail: retrieveTextField('ukCashWithdrawalDetail'),
    intDebitCardPayDetail: retrieveTextField('intDebitCardPayDetail'),
    transactionFeeBrochure: retrieveTextField('transactionFeeBrochure'),
    debitCardReplacementFeeBrochure: retrieveTextField(
      'debitCardReplacemntFeeBrochure',
    ),
    unpaidItemDetail: retrieveTextField('unpaidItemDetail'),
    paidItemDetail: retrieveTextField('paidItemDetail'),
    unarrangedODDetailBrochure: retrieveTextField('unarrangedODDetailBrochure'),
    arrangedODDetailBrochure: retrieveTextField('arrangedODDetailBrochure'),
    overdraftFacility: json.overdraftFacility,
    representativeAPR: json.overdraftFacility
      ? retrieveNumberField('representativeAPR')
      : -1,
    unauthorisedOverdraftEar: retrieveNumberField('unauthorisedOverdraftEar'),
    atmWithdrawalChargePercent: retrieveNumberField(
      'atmWithdrawalChargePercent',
    ),
    features: retrieveFeatures(),
    access: retrieveAccess(),
  };
};

export default hydrateAccountFromJson;
