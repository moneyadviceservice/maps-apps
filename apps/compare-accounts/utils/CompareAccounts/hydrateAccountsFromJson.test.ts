import hydrateAccountsFromJson from './hydrateAccountsFromJson';
import hydrateAccountFromJson from './hydrateAccountFromJson';

jest.mock('./hydrateAccountFromJson');

describe('hydrateAccountsFromJson', () => {
  const mockHydrateAccountFromJson =
    hydrateAccountFromJson as jest.MockedFunction<
      typeof hydrateAccountFromJson
    >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHydrateAccountFromJson.mockImplementation((json) => ({
      id: json.id,
      name: json.productName,
      providerName: json.providerName,
      url: 'https://example.com',
      type: 'standard',
      monthlyFee: null,
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
      unauthODMonthlyCap: null,
      minimumMonthlyCredit: null,
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
      overdraftFacility: false,
      representativeAPR: null,
      unauthorisedOverdraftEar: null,
      atmWithdrawalChargePercent: null,
      features: [],
      access: [],
    }));
  });

  it('should filter and hydrate only MAS specific accounts', () => {
    const json = {
      items: [
        {
          id: '1',
          productName: 'Account 1',
          providerName: 'Bank A',
          maspacsPrimaryProduct: true,
        },
        {
          id: '2',
          productName: 'Account 2',
          providerName: 'Bank B',
          maspacsPrimaryProduct: false,
        },
        {
          id: '3',
          productName: 'Account 3',
          providerName: 'Bank C',
          maspacsPrimaryProduct: true,
        },
        { id: '4', productName: 'Account 4', providerName: 'Bank D' },
      ],
    };

    const result = hydrateAccountsFromJson(json);

    expect(result).toHaveLength(2);
    expect(mockHydrateAccountFromJson).toHaveBeenCalledTimes(2);
    expect(mockHydrateAccountFromJson).toHaveBeenCalledWith(json.items[0]);
    expect(mockHydrateAccountFromJson).toHaveBeenCalledWith(json.items[2]);
  });

  it('should return empty array when no MAS specific accounts exist', () => {
    const json = {
      items: [
        { id: '1', productName: 'Account 1', maspacsPrimaryProduct: false },
        { id: '2', productName: 'Account 2', maspacsPrimaryProduct: false },
      ],
    };

    const result = hydrateAccountsFromJson(json);

    expect(result).toEqual([]);
    expect(mockHydrateAccountFromJson).not.toHaveBeenCalled();
  });

  it('should handle null json input', () => {
    const result = hydrateAccountsFromJson(null);

    expect(result).toEqual([]);
    expect(mockHydrateAccountFromJson).not.toHaveBeenCalled();
  });

  it('should handle undefined json input', () => {
    const result = hydrateAccountsFromJson(undefined);

    expect(result).toEqual([]);
    expect(mockHydrateAccountFromJson).not.toHaveBeenCalled();
  });

  it('should handle json with no items property', () => {
    const json = {} as any;

    const result = hydrateAccountsFromJson(json);

    expect(result).toEqual([]);
    expect(mockHydrateAccountFromJson).not.toHaveBeenCalled();
  });

  it('should handle json with empty items array', () => {
    const json = {
      items: [],
    };

    const result = hydrateAccountsFromJson(json);

    expect(result).toEqual([]);
    expect(mockHydrateAccountFromJson).not.toHaveBeenCalled();
  });

  it('should process multiple MAS specific accounts correctly', () => {
    const json = {
      items: [
        {
          id: '1',
          productName: 'Premium Account',
          providerName: 'Bank A',
          maspacsPrimaryProduct: true,
        },
        {
          id: '2',
          productName: 'Basic Account',
          providerName: 'Bank B',
          maspacsPrimaryProduct: true,
        },
        {
          id: '3',
          productName: 'Student Account',
          providerName: 'Bank C',
          maspacsPrimaryProduct: true,
        },
      ],
    };

    const result = hydrateAccountsFromJson(json);

    expect(result).toHaveLength(3);
    expect(mockHydrateAccountFromJson).toHaveBeenCalledTimes(3);

    // Verify the returned accounts have the expected structure
    result.forEach((account, index) => {
      expect(account).toHaveProperty('id', json.items[index].id);
      expect(account).toHaveProperty('name', json.items[index].productName);
      expect(account).toHaveProperty(
        'providerName',
        json.items[index].providerName,
      );
    });
  });

  it('should maintain the order of accounts after filtering', () => {
    const json = {
      items: [
        { id: '1', productName: 'First', maspacsPrimaryProduct: true },
        { id: '2', productName: 'Second', maspacsPrimaryProduct: false },
        { id: '3', productName: 'Third', maspacsPrimaryProduct: true },
        { id: '4', productName: 'Fourth', maspacsPrimaryProduct: false },
        { id: '5', productName: 'Fifth', maspacsPrimaryProduct: true },
      ],
    };

    const result = hydrateAccountsFromJson(json);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('3');
    expect(result[2].id).toBe('5');
  });

  it('should handle accounts with various truthy/falsy maspacsPrimaryProduct values', () => {
    const json = {
      items: [
        { id: '1', productName: 'Account 1', maspacsPrimaryProduct: true },
        { id: '2', productName: 'Account 2', maspacsPrimaryProduct: 'true' }, // truthy string
        { id: '3', productName: 'Account 3', maspacsPrimaryProduct: 1 }, // truthy number
        { id: '4', productName: 'Account 4', maspacsPrimaryProduct: false },
        { id: '5', productName: 'Account 5', maspacsPrimaryProduct: 0 }, // falsy number
        { id: '6', productName: 'Account 6', maspacsPrimaryProduct: '' }, // falsy string
        { id: '7', productName: 'Account 7', maspacsPrimaryProduct: null }, // falsy null
        { id: '8', productName: 'Account 8', maspacsPrimaryProduct: undefined }, // falsy undefined
      ],
    };

    const result = hydrateAccountsFromJson(json);

    // Filter uses truthy check, so 'true', true, and 1 should pass
    expect(result).toHaveLength(3);
    expect(mockHydrateAccountFromJson).toHaveBeenCalledTimes(3);
    expect(mockHydrateAccountFromJson).toHaveBeenCalledWith(json.items[0]);
    expect(mockHydrateAccountFromJson).toHaveBeenCalledWith(json.items[1]);
    expect(mockHydrateAccountFromJson).toHaveBeenCalledWith(json.items[2]);
  });
});
