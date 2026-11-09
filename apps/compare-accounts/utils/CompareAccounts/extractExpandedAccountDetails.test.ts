import extractExpandedAccountDetails from './extractExpandedAccountDetails';
import formatMoney from './formatMoney';
import formatPercentage from './formatPercentage';

// Mock the format functions
jest.mock('./formatMoney');
jest.mock('./formatPercentage');

describe('extractExpandedAccountDetails', () => {
  const mockFormatMoney = formatMoney as jest.MockedFunction<
    typeof formatMoney
  >;
  const mockFormatPercentage = formatPercentage as jest.MockedFunction<
    typeof formatPercentage
  >;

  const mockTranslation = jest.fn().mockImplementation(({ en }) => en);

  const baseAccount = {
    id: 'test-account-1',
    name: 'Test Current Account',
    providerName: 'Test Bank',
    url: 'https://example.com',
    type: 'current-account',
    access: ['online', 'mobile'],
    features: ['contactless', 'mobile-banking'],
    monthlyFee: { amount: 10, currency: 'GBP', scale: 2 },
    monthlyChargeBrochure: 'Monthly charge details',
    minimumMonthlyCredit: { amount: 1000, currency: 'GBP', scale: 2 },
    minimumMonthlyCreditBrochure: 'Minimum deposit details',
    overdraftFacility: true,
    representativeAPR: 19.9,
    arrangedODExample1: { amount: 25, currency: 'GBP', scale: 2 },
    arrangedODExample2: { amount: 100, currency: 'GBP', scale: 2 },
    arrangedODDetailBrochure: 'Arranged overdraft details',
    unauthorisedOverdraftEar: 39.9,
    unauthODMonthlyCap: { amount: 50, currency: 'GBP', scale: 2 },
    unarrangedODDetailBrochure: 'Unarranged overdraft details',
    unpaidItemDetail: 'Unpaid item details',
    paidItemDetail: 'paid item details',
    debitCardIssueFee: { amount: 0, currency: 'GBP', scale: 2 },
    debitCardReplacementFee: { amount: 5, currency: 'GBP', scale: 2 },
    debitCardReplacementFeeBrochure: 'Card replacement details',
    transactionFee: { amount: 0, currency: 'GBP', scale: 2 },
    transactionFeeBrochure: 'Transaction fee details',
    debitEU50Cost: { amount: 250, currency: 'GBP', scale: 2 },
    debitWorld50Cost: { amount: 350, currency: 'GBP', scale: 2 },
    intDebitCardPayDetail: 'International debit card details',
    atmMaxFreeWithdrawalUK: 300,
    atmWithdrawalCharge: { amount: 150, currency: 'GBP', scale: 2 },
    atmWithdrawalChargePercent: 2.5,
    ukCashWithdrawalDetail: 'UK cash withdrawal details',
    atmEU50Cost: { amount: 300, currency: 'GBP', scale: 2 },
    atmWorld50Cost: { amount: 400, currency: 'GBP', scale: 2 },
    intCashWithdrawDetail: 'International cash withdrawal details',
    directDebitCharge: { amount: 0, currency: 'GBP', scale: 2 },
    standingOrderCharge: { amount: 0, currency: 'GBP', scale: 2 },
    bacsCharge: { amount: 0, currency: 'GBP', scale: 2 },
    fasterPaymentsCharge: { amount: 0, currency: 'GBP', scale: 2 },
    chapsCharge: { amount: 2500, currency: 'GBP', scale: 2 },
    payOutEUMinChrg: { amount: 1000, currency: 'GBP', scale: 2 },
    payOutEUMaxChrg: { amount: 2500, currency: 'GBP', scale: 2 },
    payOutWorldMinChrg: { amount: 1500, currency: 'GBP', scale: 2 },
    payOutWorldMaxChrg: { amount: 4000, currency: 'GBP', scale: 2 },
    intPaymentsOutDetail: 'International payments out details',
    payInEUMinChrg: { amount: 500, currency: 'GBP', scale: 2 },
    payInEUMaxChrg: { amount: 1500, currency: 'GBP', scale: 2 },
    payInWorldMinChrg: { amount: 800, currency: 'GBP', scale: 2 },
    payInWorldMaxChrg: { amount: 2000, currency: 'GBP', scale: 2 },
    intPaymentsInDetail: 'International payments in details',
    stoppedChequeCharge: { amount: 1000, currency: 'GBP', scale: 2 },
    otherChargesBrochure: 'Other charges details',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatMoney.mockImplementation((value) => `£${value || 0}.00`);
    mockFormatPercentage.mockImplementation((value) => `${value || 0}%`);
  });

  it('should return structured account details with all sections', () => {
    const result = extractExpandedAccountDetails(baseAccount, mockTranslation);

    expect(result).toHaveLength(6); // 6 main sections
    expect(result[0].title).toBe('General account fees');
    expect(result[1].title).toBe('Overdraft fees');
    expect(result[2].title).toBe('Debit card fees');
    expect(result[3].title).toBe('Cash withdrawal fees');
    expect(result[4].title).toBe('Payment fees');
    expect(result[5].title).toBe('Other fees');
  });

  it('should format money values correctly in general account fees', () => {
    extractExpandedAccountDetails(baseAccount, mockTranslation);

    expect(mockFormatMoney).toHaveBeenCalledWith(baseAccount.monthlyFee);
    expect(mockFormatMoney).toHaveBeenCalledWith(
      baseAccount.minimumMonthlyCredit,
    );
  });

  it('should handle overdraft facility enabled correctly', () => {
    const result = extractExpandedAccountDetails(baseAccount, mockTranslation);

    const overdraftSection = result[1]; // Overdraft fees section
    const arrangedOverdraftSection = overdraftSection.sections[0];
    const unarrangedOverdraftSection = overdraftSection.sections[1];

    // Should have 4 items for arranged overdraft when facility is enabled
    expect(arrangedOverdraftSection.items).toHaveLength(4);
    expect(arrangedOverdraftSection.items[0].type).toBe('detail');
    expect(arrangedOverdraftSection.items[0].title).toBe(
      'Annual interest rate (APR)',
    );

    // Should have 3 items for unarranged overdraft when facility is enabled
    expect(unarrangedOverdraftSection.items).toHaveLength(3);
    expect(unarrangedOverdraftSection.items[0].title).toBe(
      'Annual interest rate (APR/EAR)',
    );
  });

  it('should handle overdraft facility disabled correctly', () => {
    const accountWithoutOverdraft = {
      ...baseAccount,
      overdraftFacility: false,
    };

    const result = extractExpandedAccountDetails(
      accountWithoutOverdraft,
      mockTranslation,
    );

    const overdraftSection = result[1];
    const arrangedOverdraftSection = overdraftSection.sections[0];
    const unarrangedOverdraftSection = overdraftSection.sections[1];

    // Should have 1 item for arranged overdraft when facility is disabled
    expect(arrangedOverdraftSection.items).toHaveLength(1);
    expect(arrangedOverdraftSection.items[0].type).toBe('detail');
    expect(arrangedOverdraftSection.items[0].value).toBe(
      baseAccount.arrangedODDetailBrochure,
    );

    // Should have 1 item for unarranged overdraft when facility is disabled
    expect(unarrangedOverdraftSection.items).toHaveLength(1);
    expect(unarrangedOverdraftSection.items[0].value).toBe(
      baseAccount.unarrangedODDetailBrochure,
    );
  });

  it('should format percentage values correctly', () => {
    extractExpandedAccountDetails(baseAccount, mockTranslation);

    expect(mockFormatPercentage).toHaveBeenCalledWith(
      baseAccount.representativeAPR,
    );
    expect(mockFormatPercentage).toHaveBeenCalledWith(
      baseAccount.unauthorisedOverdraftEar,
    );
    expect(mockFormatPercentage).toHaveBeenCalledWith(
      baseAccount.atmWithdrawalChargePercent,
    );
  });

  it('should handle unauthODMonthlyCap with value', () => {
    const result = extractExpandedAccountDetails(baseAccount, mockTranslation);

    const overdraftSection = result[1];
    const unarrangedOverdraftSection = overdraftSection.sections[1];
    const monthlyMaxChargeItem = unarrangedOverdraftSection.items[1];

    expect(monthlyMaxChargeItem.title).toBe('Monthly Maximum Charge');
    expect(mockFormatMoney).toHaveBeenCalledWith(
      baseAccount.unauthODMonthlyCap,
    );
  });

  it('should handle unauthODMonthlyCap without value', () => {
    const accountWithoutMonthlyCap = {
      ...baseAccount,
      unauthODMonthlyCap: null,
    };

    const result = extractExpandedAccountDetails(
      accountWithoutMonthlyCap,
      mockTranslation,
    );

    const overdraftSection = result[1];
    const unarrangedOverdraftSection = overdraftSection.sections[1];
    const monthlyMaxChargeItem = unarrangedOverdraftSection.items[1];

    expect(monthlyMaxChargeItem.value).toBe('No limit');
  });

  it('should capitalize paidItemDetail correctly', () => {
    const result = extractExpandedAccountDetails(baseAccount, mockTranslation);

    const overdraftSection = result[1];
    const otherFeesSection = overdraftSection.sections[2];
    const paidItemItem = otherFeesSection.items[1];

    expect(paidItemItem.value).toBe('Paid item details'); // First letter capitalized
  });

  it('should handle empty paidItemDetail', () => {
    const accountWithEmptyPaidItem = {
      ...baseAccount,
      paidItemDetail: '',
    };

    const result = extractExpandedAccountDetails(
      accountWithEmptyPaidItem,
      mockTranslation,
    );

    const overdraftSection = result[1];
    const otherFeesSection = overdraftSection.sections[2];
    const paidItemItem = otherFeesSection.items[1];

    expect(paidItemItem.value).toBe('');
  });

  it('should handle atmMaxFreeWithdrawalUK with value', () => {
    extractExpandedAccountDetails(baseAccount, mockTranslation);

    expect(mockFormatMoney).toHaveBeenCalledWith(
      baseAccount.atmMaxFreeWithdrawalUK,
    );
  });

  it('should handle atmMaxFreeWithdrawalUK without value', () => {
    const accountWithoutATMLimit = {
      ...baseAccount,
      atmMaxFreeWithdrawalUK: null,
    };

    const result = extractExpandedAccountDetails(
      accountWithoutATMLimit,
      mockTranslation,
    );

    const cashWithdrawalSection = result[3];
    const ukSection = cashWithdrawalSection.sections[0];
    const limitItem = ukSection.items[0];

    expect(limitItem.value).toBe('No limit');
  });

  it('should format payment fees with range when max charge exists', () => {
    const result = extractExpandedAccountDetails(baseAccount, mockTranslation);

    const paymentSection = result[4];
    const sendingOutsideUKSection = paymentSection.sections[1];
    const euItem = sendingOutsideUKSection.items[0];
    const worldwideItem = sendingOutsideUKSection.items[1];

    expect(euItem.value).toContain(' - '); // Should contain range separator
    expect(worldwideItem.value).toContain(' - '); // Should contain range separator
  });

  it('should format payment fees with minimum charge when max charge is null', () => {
    const accountWithoutMaxCharges = {
      ...baseAccount,
      payOutEUMaxChrg: null,
      payOutWorldMaxChrg: null,
    };

    const result = extractExpandedAccountDetails(
      accountWithoutMaxCharges,
      mockTranslation,
    );

    const paymentSection = result[4];
    const sendingOutsideUKSection = paymentSection.sections[1];
    const euItem = sendingOutsideUKSection.items[0];
    const worldwideItem = sendingOutsideUKSection.items[1];

    expect(euItem.value).toContain('Minimum charge: ');
    expect(worldwideItem.value).toContain('Minimum charge: ');
  });

  it('should always format receiving money as ranges', () => {
    const result = extractExpandedAccountDetails(baseAccount, mockTranslation);

    const paymentSection = result[4];
    const receivingSection = paymentSection.sections[2];
    const euItem = receivingSection.items[0];
    const worldwideItem = receivingSection.items[1];

    expect(euItem.value).toContain(' - ');
    expect(worldwideItem.value).toContain(' - ');
  });

  it('should call translation function with correct parameters', () => {
    extractExpandedAccountDetails(baseAccount, mockTranslation);

    expect(mockTranslation).toHaveBeenCalledWith({
      en: 'General account fees',
      cy: 'Ffioedd cyfrif cyffredinol',
    });
    expect(mockTranslation).toHaveBeenCalledWith({
      en: 'Overdraft fees',
      cy: 'Ffioedd gorddrafft',
    });
    expect(mockTranslation).toHaveBeenCalledWith({
      en: 'Debit card fees',
      cy: 'Ffioedd cerdyn debyd',
    });
  });

  it('should handle all read-more items', () => {
    const result = extractExpandedAccountDetails(baseAccount, mockTranslation);

    // Count all read-more items across all sections
    const readMoreCount = result
      .flatMap((section) => section.sections)
      .flatMap((subsection) => subsection.items)
      .filter((item) => item.type === 'read-more').length;

    expect(readMoreCount).toBeGreaterThan(0);
  });

  it('should handle missing or undefined account properties', () => {
    const minimalAccount = {
      ...baseAccount,
      overdraftFacility: false,
    };

    const result = extractExpandedAccountDetails(
      minimalAccount,
      mockTranslation,
    );

    expect(result).toHaveLength(6);
    expect(result[0].title).toBe('General account fees');
  });

  it('should structure items correctly with type and title properties', () => {
    const result = extractExpandedAccountDetails(baseAccount, mockTranslation);

    const firstSection = result[0];
    const firstSubsection = firstSection.sections[0];
    const firstItem = firstSubsection.items[0];

    expect(firstItem).toHaveProperty('type');
    expect(firstItem).toHaveProperty('title');
    expect(firstItem).toHaveProperty('value');
    expect(firstItem.type).toBe('detail');
  });
});
