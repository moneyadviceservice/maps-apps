import findAccounts from './findAccounts';
import { Account } from './hydrateAccountFromJson';
import { createTestAccount, createCurrencyAmount } from './testHelpers';

jest.mock('date-fns', () => ({
  getYear: jest.fn(),
  getDayOfYear: jest.fn(),
  getHours: jest.fn(),
}));

describe('findAccounts', () => {
  const defaultSearchOptions = {
    searchQuery: '',
    order: 'accountNameAZ',
    accountTypes: [],
    accountFeatures: [],
    accountAccess: [],
  };

  const accounts: Account[] = [
    createTestAccount({
      id: '1',
      name: 'Basic Account',
      providerName: 'Provider A',
      url: 'https://example.com/basic',
      type: 'basic',
      features: ['overdraftFacilities', 'mobileAppBanking'],
      access: ['online', 'mobile'],
      monthlyFee: createCurrencyAmount(1000),
      unauthODMonthlyCap: createCurrencyAmount(2000),
      minimumMonthlyCredit: createCurrencyAmount(50000),
      overdraftFacility: true,
      representativeAPR: 19.9,
    }),
    createTestAccount({
      id: '2',
      name: 'Premium Account',
      providerName: 'Provider B',
      url: 'https://example.com/premium',
      type: 'premium',
      features: ['cashback', 'mobileAppBanking'],
      access: ['in-branch', 'online'],
      monthlyFee: createCurrencyAmount(1500),
      unauthODMonthlyCap: createCurrencyAmount(5000),
      minimumMonthlyCredit: createCurrencyAmount(100000),
      overdraftFacility: true,
      representativeAPR: 12.5,
    }),
    createTestAccount({
      id: '3',
      name: 'Standard Account',
      providerName: 'Provider C',
      url: 'https://example.com/standard',
      type: 'standard',
      features: ['overdraftFacilities'],
      access: ['mobile'],
      monthlyFee: createCurrencyAmount(500),
      unauthODMonthlyCap: createCurrencyAmount(0),
      minimumMonthlyCredit: createCurrencyAmount(30000),
      overdraftFacility: true,
      representativeAPR: 25.0,
    }),
  ];

  it('should filter accounts by searchQuery (case-insensitive)', () => {
    const result = findAccounts(accounts, {
      ...defaultSearchOptions,
      searchQuery: 'basic',
    });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Basic Account');
  });

  it('should order accounts by providerName in ascending order (A-Z)', () => {
    const result = findAccounts(accounts, {
      ...defaultSearchOptions,
      order: 'providerNameAZ',
    });
    expect(result[0].providerName).toBe('Provider A');
    expect(result[1].providerName).toBe('Provider B');
    expect(result[2].providerName).toBe('Provider C');
  });

  it('should filter accounts by accountType', () => {
    const result = findAccounts(accounts, {
      ...defaultSearchOptions,
      accountTypes: ['premium'],
    });
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('premium');
  });

  it('should filter accounts by features (multiple features)', () => {
    const result = findAccounts(accounts, {
      ...defaultSearchOptions,
      accountFeatures: ['mobileAppBanking'],
    });
    expect(result.length).toBe(2);
    expect(result[0].features).toContain('mobileAppBanking');
    expect(result[1].features).toContain('mobileAppBanking');
  });

  it('should filter accounts by access', () => {
    const result = findAccounts(accounts, {
      ...defaultSearchOptions,
      accountAccess: ['mobile'],
    });
    expect(result.length).toBe(2);
    expect(result[0].access).toContain('mobile');
    expect(result[1].access).toContain('mobile');
  });

  it('should return accounts with no filters applied', () => {
    const result = findAccounts(accounts, defaultSearchOptions);
    expect(result.length).toBe(3);
  });

  it('should return an empty array when no accounts match the searchQuery', () => {
    const result = findAccounts(accounts, {
      ...defaultSearchOptions,
      searchQuery: 'Nonexistent Account',
    });
    expect(result.length).toBe(0); // No match expected
  });

  it('should return all accounts when no filters are applied', () => {
    const result = findAccounts(accounts, defaultSearchOptions);
    expect(result.length).toBe(3); // All accounts should be returned
  });

  it('should handle an empty list of accounts', () => {
    const result = findAccounts([], defaultSearchOptions);
    expect(result.length).toBe(0); // No accounts should be returned
  });

  describe('orderMatches - additional ordering options', () => {
    describe.each([
      {
        order: 'providerNameZA',
        description:
          'should order accounts by providerName in descending order (Z-A)',
        expectedOrder: ['Provider C', 'Provider B', 'Provider A'],
        getField: (account: Account) => account.providerName,
      },
      {
        order: 'accountNameZA',
        description:
          'should order accounts by accountName in descending order (Z-A)',
        expectedOrder: ['Standard Account', 'Premium Account', 'Basic Account'],
        getField: (account: Account) => account.name,
      },
      {
        order: 'monthlyAccountFeeLowestFirst',
        description: 'should order accounts by monthly fee (lowest first)',
        expectedOrder: ['Standard Account', 'Basic Account', 'Premium Account'],
        getField: (account: Account) => account.name,
        comment: '£5, £10, £15',
      },
      {
        order: 'minimumMonthlyDepositLowestFirst',
        description:
          'should order accounts by minimum monthly deposit (lowest first)',
        expectedOrder: ['Standard Account', 'Basic Account', 'Premium Account'],
        getField: (account: Account) => account.name,
        comment: '£300, £500, £1000',
      },
    ])('$description', ({ order, expectedOrder, getField, comment }) => {
      it(`${comment || ''}`, () => {
        const result = findAccounts(accounts, {
          ...defaultSearchOptions,
          order,
        });

        const actualOrder = result.map(getField);
        expect(actualOrder).toEqual(expectedOrder);
      });
    });

    it('should order accounts by arranged overdraft rate (lowest first)', () => {
      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        order: 'arrangedOverdraftRateLowestFirst',
      });
      expect(result[0].representativeAPR).toBe(12.5);
      expect(result[1].representativeAPR).toBe(19.9);
      expect(result[2].representativeAPR).toBe(25.0);
    });

    it('should handle accounts with zero or negative APR when ordering by arranged overdraft', () => {
      const accountsWithSpecialAPR: Account[] = [
        createTestAccount({
          id: '4',
          name: 'Zero APR Account',
          providerName: 'Provider D',
          url: 'https://example.com/zero',
          type: 'basic',
          features: [],
          access: [],
          overdraftFacility: true,
          representativeAPR: 0,
          monthlyFee: null,
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: null,
        }),
        createTestAccount({
          id: '5',
          name: 'Negative APR Account',
          providerName: 'Provider E',
          url: 'https://example.com/negative',
          type: 'basic',
          features: [],
          access: [],
          overdraftFacility: true,
          representativeAPR: -1,
          monthlyFee: null,
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: null,
        }),
        ...accounts,
      ];

      const result = findAccounts(accountsWithSpecialAPR, {
        ...defaultSearchOptions,
        order: 'arrangedOverdraftRateLowestFirst',
      });

      expect(result[0].representativeAPR).toBe(12.5);
      expect(result[1].representativeAPR).toBe(19.9);
      expect(result[2].representativeAPR).toBe(25.0);
      expect(result[3].representativeAPR).toBe(0);
      expect(result[4].representativeAPR).toBe(-1);
    });

    it('should order accounts by unarranged overdraft monthly cap (lowest first)', () => {
      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        order: 'unarrangedMaximumMonthlyChargeLowestFirst',
      });
      expect(result[0].name).toBe('Standard Account');
      expect(result[1].name).toBe('Basic Account');
      expect(result[2].name).toBe('Premium Account');
    });

    it('should handle null and string unauthODMonthlyCap when ordering', () => {
      const accountsWithVariousCaps: Account[] = [
        ...accounts,
        createTestAccount({
          id: '4',
          name: 'Null Cap Account',
          providerName: 'Provider D',
          url: 'https://example.com/null',
          type: 'basic',
          features: [],
          access: [],
          overdraftFacility: true,
          representativeAPR: 20,
          monthlyFee: null,
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: null,
        }),
        createTestAccount({
          id: '5',
          name: 'String Cap Account',
          providerName: 'Provider E',
          url: 'https://example.com/string',
          type: 'basic',
          features: [],
          access: [],
          overdraftFacility: true,
          representativeAPR: 20,
          monthlyFee: null,
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: 'No limit',
        }),
      ];

      const result = findAccounts(accountsWithVariousCaps, {
        ...defaultSearchOptions,
        order: 'unarrangedMaximumMonthlyChargeLowestFirst',
      });

      expect(result[0].name).toBe('Standard Account');
      expect(result[1].name).toBe('Basic Account');
      expect(result[2].name).toBe('Premium Account');
      expect(result[3].name).toBe('Null Cap Account');
      expect(result[4].name).toBe('String Cap Account');
    });

    it('should return empty array for invalid order option', () => {
      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        order: 'invalidOrder',
      });
      expect(result).toEqual([]);
    });

    it('should shuffle accounts when order is random', () => {
      const mockGetYear = jest.requireMock('date-fns').getYear;
      const mockGetDayOfYear = jest.requireMock('date-fns').getDayOfYear;
      const mockGetHours = jest.requireMock('date-fns').getHours;

      mockGetYear.mockReturnValue(2024);
      mockGetDayOfYear.mockReturnValue(15);
      mockGetHours.mockReturnValue(10);

      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        order: 'random',
      });

      expect(result.length).toBe(3);
      expect(
        result.map((a) => a.id).sort((a, b) => a.localeCompare(b)),
      ).toEqual(['1', '2', '3']);

      mockGetYear.mockRestore();
      mockGetDayOfYear.mockRestore();
      mockGetHours.mockRestore();
    });
  });

  describe('searchMatches', () => {
    it('should search in both name and providerName fields', () => {
      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        searchQuery: 'provider b',
      });
      expect(result.length).toBe(1);
      expect(result[0].providerName).toBe('Provider B');
    });

    it('should handle special characters in search query', () => {
      const accountsWithSpecialChars: Account[] = [
        createTestAccount({
          id: '4',
          name: 'Special!@# Account',
          providerName: 'Provider$%^',
          url: 'https://example.com/special',
          type: 'basic',
          features: [],
          access: [],
          overdraftFacility: true,
          representativeAPR: 20,
          monthlyFee: null,
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: null,
        }),
      ];

      const result = findAccounts(accountsWithSpecialChars, {
        ...defaultSearchOptions,
        searchQuery: 'special!@#',
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Special!@# Account');
    });
  });

  describe('filterMatches', () => {
    it('should filter by multiple accountTypes', () => {
      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        accountTypes: ['basic', 'standard'],
      });
      expect(result.length).toBe(2);
      expect(result.map((a) => a.type)).toContain('basic');
      expect(result.map((a) => a.type)).toContain('standard');
    });

    it('should require all specified features to match', () => {
      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        accountFeatures: ['overdraftFacilities', 'mobileAppBanking'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Basic Account');
    });

    it('should require all specified access methods to match', () => {
      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        accountAccess: ['online', 'mobile'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Basic Account');
    });

    it('should combine all filters (type, features, access)', () => {
      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        accountTypes: ['basic'],
        accountFeatures: ['overdraftFacilities'],
        accountAccess: ['mobile'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Basic Account');
    });

    it('should return no results when filters have no matches', () => {
      const result = findAccounts(accounts, {
        ...defaultSearchOptions,
        accountTypes: ['nonexistent'],
      });
      expect(result.length).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle accounts with null monthlyFee when ordering by fee', () => {
      const accountsWithNullFee: Account[] = [
        ...accounts,
        createTestAccount({
          id: '4',
          name: 'Null Fee Account',
          providerName: 'Provider D',
          url: 'https://example.com/null-fee',
          type: 'basic',
          features: [],
          access: [],
          overdraftFacility: true,
          representativeAPR: 20,
          monthlyFee: null,
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: null,
        }),
      ];

      const result = findAccounts(accountsWithNullFee, {
        ...defaultSearchOptions,
        order: 'monthlyAccountFeeLowestFirst',
      });

      expect(result[0].name).toBe('Null Fee Account');
    });

    it('should handle equal values when ordering', () => {
      const accountsWithEqualFees: Account[] = [
        createTestAccount({
          id: '1',
          name: 'Account A',
          providerName: 'Provider',
          url: 'https://example.com/a',
          type: 'basic',
          features: [],
          access: [],
          overdraftFacility: true,
          representativeAPR: 20,
          monthlyFee: createCurrencyAmount(1000),
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: null,
        }),
        createTestAccount({
          id: '2',
          name: 'Account B',
          providerName: 'Provider',
          url: 'https://example.com/b',
          type: 'basic',
          features: [],
          access: [],
          overdraftFacility: true,
          representativeAPR: 20,
          monthlyFee: createCurrencyAmount(1000),
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: null,
        }),
      ];

      const result = findAccounts(accountsWithEqualFees, {
        ...defaultSearchOptions,
        order: 'monthlyAccountFeeLowestFirst',
      });

      expect(result.length).toBe(2);
      expect(result.map((a) => a.id)).toEqual(['1', '2']);
    });

    it('should handle null representativeAPR when ordering by overdraft rate', () => {
      const accountsWithNullAPR: Account[] = [
        createTestAccount({
          id: '4',
          name: 'Null APR Account',
          providerName: 'Provider D',
          url: 'https://example.com/null-apr',
          type: 'basic',
          features: [],
          access: [],
          overdraftFacility: true,
          representativeAPR: null,
          monthlyFee: null,
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: null,
        }),
        ...accounts,
      ];

      const result = findAccounts(accountsWithNullAPR, {
        ...defaultSearchOptions,
        order: 'arrangedOverdraftRateLowestFirst',
      });

      expect(result).toHaveLength(3);
      expect(result[0].representativeAPR).toBe(12.5);
      expect(result[1].representativeAPR).toBe(19.9);
      expect(result[2].representativeAPR).toBe(25.0);
    });
  });

  describe('combined operations', () => {
    it('should apply search, filter, and order together', () => {
      const extendedAccounts: Account[] = [
        ...accounts,
        createTestAccount({
          id: '4',
          name: 'Basic Savings',
          providerName: 'Provider A',
          url: 'https://example.com/savings',
          type: 'basic',
          features: ['mobileAppBanking'],
          access: ['mobile'],
          monthlyFee: createCurrencyAmount(200),
          overdraftFacility: true,
          representativeAPR: 15,
          minimumMonthlyCredit: null,
          unauthODMonthlyCap: null,
        }),
      ];

      const result = findAccounts(extendedAccounts, {
        searchQuery: 'basic',
        order: 'monthlyAccountFeeLowestFirst',
        accountTypes: ['basic'],
        accountFeatures: ['mobileAppBanking'],
        accountAccess: [],
      });

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Basic Savings');
      expect(result[1].name).toBe('Basic Account');
    });
  });
});
