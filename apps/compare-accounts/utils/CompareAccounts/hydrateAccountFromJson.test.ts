import { GBP } from '@dinero.js/currencies';
import hydrateAccountFromJson from './hydrateAccountFromJson';

jest.mock('./accountMapping', () => ({
  accountTypeLabelFromDefaqtoAccountType: jest.fn((type: string) => {
    const mapping: { [key: string]: string } = {
      standard: 'standardCurrent',
      'fee free basic account': 'feeFreeBasicBank',
      Student: 'student',
    };
    return mapping[type] || 'unknown';
  }),
}));

describe('hydrateAccountFromJson', () => {
  const baseAccountJson = {
    id: 'acc-123',
    productName: 'Basic Current Account',
    providerName: 'Test Bank',
    productLandingPageURL: 'www.testbank.com/basic',
    accountType: 'standard',
    monthlyCharge: '10.50',
    transactionFee: '0',
    debitEU50Cost: '15.00',
    debitWorld50Cost: '25.00',
    atmMaxFreeWithdrawalUK: '300',
    atmWithdrawalCharge: '1.50',
    atmEU50Cost: '5.00',
    atmWorld50Cost: '10.00',
    directDebitCharge: '0',
    standingOrderCharge: '0',
    bacsCharge: '0',
    fasterPaymentsCharge: '0',
    chapsCharge: '25.00',
    payOutEUMinChrg: '5.00',
    payOutEUMaxChrg: '15.00',
    payOutWorldMinChrg: '10.00',
    payOutWorldMaxChrg: '25.00',
    payInEUMinChrg: '0',
    payInEUMaxChrg: '5.00',
    payInWorldMinChrg: '0',
    payInWorldMaxChrg: '10.00',
    stoppedChequeCharge: '10.00',
    unauthODMonthlyCap: '20.00',
    minimumMonthlyCredit: '1000',
    arrangedODExample1: '50.00',
    arrangedODExample2: '100.00',
    debitCardIssueFee: '0',
    debitCardReplacementFee: '5.00',
    monthlyChargeBrochure: 'Monthly fee applies',
    minimumMonthlyCreditBrochure: 'Minimum £1000 per month',
    otherChargesBrochure: 'Other charges may apply',
    intPaymentsInDetail: 'International payments in detail',
    intPaymentsOutDetail: 'International payments out detail',
    intCashWithdrawDetail: 'International cash withdrawal detail',
    ukCashWithdrawalDetail: 'UK cash withdrawal detail',
    intDebitCardPayDetail: 'International debit card payment detail',
    transactionFeeBrochure: 'Transaction fees apply',
    debitCardReplacementFeeBrochure: '£5 replacement fee',
    unpaidItemDetail: 'Unpaid item charges apply',
    paidItemDetail: 'Paid item charges apply',
    unarrangedODDetailBrochure: 'Unarranged overdraft details',
    arrangedODDetailBrochure: 'Arranged overdraft details',
    overdraftFacility: true,
    representativeAPR: 19.9,
    unauthorisedOverdraftEar: 39.9,
    atmWithdrawalChargePercent: 2.5,
    branchBanking: true,
    internetBanking: true,
    mobilePhoneApp: true,
    postOfficeBanking: false,
    chequeBook: 'Yes',
    existingCustomer: false,
    bacsSwitchService: true,
  };

  it('should hydrate basic account information correctly', () => {
    const result = hydrateAccountFromJson(baseAccountJson);

    expect(result.id).toBe('acc-123');
    expect(result.name).toBe('Basic Current Account');
    expect(result.providerName).toBe('Test Bank');
    expect(result.type).toBe('standardCurrent');
  });

  it('should add https:// prefix to URL if missing', () => {
    const result = hydrateAccountFromJson(baseAccountJson);
    expect(result.url).toBe('https://www.testbank.com/basic');
  });

  it('should not add https:// prefix if URL already has it', () => {
    const jsonWithHttps = {
      ...baseAccountJson,
      productLandingPageURL: 'https://www.testbank.com/secure',
    };
    const result = hydrateAccountFromJson(jsonWithHttps);
    expect(result.url).toBe('https://www.testbank.com/secure');
  });

  it('should convert money fields to Dinero format correctly', () => {
    const result = hydrateAccountFromJson(baseAccountJson);

    expect(result.monthlyFee).toEqual({
      amount: 1050,
      currency: GBP,
      scale: 2,
    });

    expect(result.atmWithdrawalCharge).toEqual({
      amount: 150,
      currency: GBP,
      scale: 2,
    });
  });

  it('should handle Infinity values as null for money fields', () => {
    const jsonWithInfinity = {
      ...baseAccountJson,
      monthlyCharge: 'Infinity',
      transactionFee: '',
    };
    const result = hydrateAccountFromJson(jsonWithInfinity);

    expect(result.monthlyFee).toBeNull();
    expect(result.transactionFee).toBeNull();
  });

  it('should clean up text fields by removing HTML and placeholders', () => {
    const jsonWithHTML = {
      ...baseAccountJson,
      monthlyChargeBrochure: '{P}Monthly fee<br/>applies<br />here',
      minimumMonthlyCreditBrochure: 'Minimum {P}£1000<br/> per month',
    };
    const result = hydrateAccountFromJson(jsonWithHTML);

    expect(result.monthlyChargeBrochure).toBe('Monthly feeapplieshere');
    expect(result.minimumMonthlyCreditBrochure).toBe('Minimum £1000 per month');
  });

  it('should return null for empty or zero text fields', () => {
    const jsonWithEmptyFields = {
      ...baseAccountJson,
      monthlyChargeBrochure: '0',
      minimumMonthlyCreditBrochure: '0.00',
      otherChargesBrochure: '0.00. <br /> ',
      intPaymentsInDetail: '0 <br /> ',
      intPaymentsOutDetail: '',
    };
    const result = hydrateAccountFromJson(jsonWithEmptyFields);

    expect(result.monthlyChargeBrochure).toBeNull();
    expect(result.minimumMonthlyCreditBrochure).toBeNull();
    expect(result.otherChargesBrochure).toBeNull();
    expect(result.intPaymentsInDetail).toBeNull();
    expect(result.intPaymentsOutDetail).toBeNull();
  });

  it('should parse access options correctly', () => {
    const result = hydrateAccountFromJson(baseAccountJson);

    expect(result.access).toContain('branchBanking');
    expect(result.access).toContain('internetBanking');
    expect(result.access).toContain('mobileAppBanking');
    expect(result.access).not.toContain('postOfficeBanking');
    expect(result.access).toHaveLength(3);
  });

  it('should parse features correctly', () => {
    const result = hydrateAccountFromJson(baseAccountJson);

    expect(result.features).toContain('chequeBookAvailable');
    expect(result.features).toContain('openToNewCustomers');
    expect(result.features).toContain('overdraftFacilities');
    expect(result.features).toContain('sevenDaySwitching');
  });

  it('should include noMonthlyFee feature when monthly charge is zero', () => {
    const jsonWithNoFee = {
      ...baseAccountJson,
      monthlyCharge: '0',
    };
    const result = hydrateAccountFromJson(jsonWithNoFee);

    expect(result.features).toContain('noMonthlyFee');
  });

  it('should handle overdraft facilities correctly', () => {
    const result = hydrateAccountFromJson(baseAccountJson);

    expect(result.overdraftFacility).toBe(true);
    expect(result.representativeAPR).toBe(19.9);
    expect(result.unauthorisedOverdraftEar).toBe(39.9);
  });

  it('should set representativeAPR to -1 when no overdraft facility', () => {
    const jsonWithoutOverdraft = {
      ...baseAccountJson,
      overdraftFacility: false,
    };
    const result = hydrateAccountFromJson(jsonWithoutOverdraft);

    expect(result.representativeAPR).toBe(-1);
  });

  it('should handle all money fields correctly', () => {
    const result = hydrateAccountFromJson(baseAccountJson);

    expect(result.debitEU50Cost).toEqual({
      amount: 1500,
      currency: GBP,
      scale: 2,
    });

    expect(result.chapsCharge).toEqual({
      amount: 2500,
      currency: GBP,
      scale: 2,
    });

    expect(result.minimumMonthlyCredit).toEqual({
      amount: 100000,
      currency: GBP,
      scale: 2,
    });
  });

  it('should handle percentage fields correctly', () => {
    const result = hydrateAccountFromJson(baseAccountJson);

    expect(result.atmWithdrawalChargePercent).toBe(2.5);
  });

  it('should handle missing or null percentage fields', () => {
    const jsonWithMissingPercent = {
      ...baseAccountJson,
      atmWithdrawalChargePercent: null,
    };
    const result = hydrateAccountFromJson(jsonWithMissingPercent);

    expect(result.atmWithdrawalChargePercent).toBe(0);
  });

  it('should not include chequeBookAvailable when chequeBook is not Yes', () => {
    const jsonWithoutChequeBook = {
      ...baseAccountJson,
      chequeBook: 'No',
    };
    const result = hydrateAccountFromJson(jsonWithoutChequeBook);

    expect(result.features).not.toContain('chequeBookAvailable');
  });

  it('should not include openToNewCustomers when existingCustomer is true', () => {
    const jsonExistingCustomer = {
      ...baseAccountJson,
      existingCustomer: true,
    };
    const result = hydrateAccountFromJson(jsonExistingCustomer);

    expect(result.features).not.toContain('openToNewCustomers');
  });

  it('should handle all access options being false', () => {
    const jsonNoAccess = {
      ...baseAccountJson,
      branchBanking: false,
      internetBanking: false,
      mobilePhoneApp: false,
      postOfficeBanking: false,
    };
    const result = hydrateAccountFromJson(jsonNoAccess);

    expect(result.access).toEqual([]);
  });

  it('should include postOfficeBanking when true', () => {
    const jsonWithPostOffice = {
      ...baseAccountJson,
      postOfficeBanking: true,
    };
    const result = hydrateAccountFromJson(jsonWithPostOffice);

    expect(result.access).toContain('postOfficeBanking');
    expect(result.access).toHaveLength(4); // All 4 access options
  });
});
