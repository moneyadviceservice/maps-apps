import findAccounts from './findAccounts';

describe('findAccounts', () => {
  const accounts = [
    {
      name: 'Basic Account',
      providerName: 'Provider A',
      type: 'basic',
      features: ['overdraftFacilities', 'mobileAppBanking'],
      access: ['online', 'mobile'],
      monthlyFee: 10,
      minimumMonthlyCredit: 500,
      representativeAPR: 19.9,
      overdraftFacility: true,
      unauthODMonthlyCap: { amount: 20 },
    },
    {
      name: 'Premium Account',
      providerName: 'Provider B',
      type: 'premium',
      features: ['cashback', 'mobileAppBanking'],
      access: ['in-branch', 'online'],
      monthlyFee: 15,
      minimumMonthlyCredit: 1000,
      representativeAPR: 12.5,
      overdraftFacility: true,
      unauthODMonthlyCap: { amount: 50 },
    },
    {
      name: 'Standard Account',
      providerName: 'Provider C',
      type: 'standard',
      features: ['overdraftFacilities'],
      access: ['mobile'],
      monthlyFee: 5,
      minimumMonthlyCredit: 300,
      representativeAPR: 25.0,
      overdraftFacility: true,
      unauthODMonthlyCap: { amount: 0 },
    },
  ];

  it('should filter accounts by searchQuery (case-insensitive)', () => {
    const result = findAccounts(accounts, {
      searchQuery: 'basic',
      order: 'accountNameAZ',
      accountTypes: [],
      accountFeatures: [],
      accountAccess: [],
    });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Basic Account');
  });

  it('should order accounts by providerName in ascending order (A-Z)', () => {
    const result = findAccounts(accounts, {
      searchQuery: '',
      order: 'providerNameAZ',
      accountTypes: [],
      accountFeatures: [],
      accountAccess: [],
    });
    expect(result[0].providerName).toBe('Provider A');
    expect(result[1].providerName).toBe('Provider B');
    expect(result[2].providerName).toBe('Provider C');
  });

  it('should filter accounts by accountType', () => {
    const result = findAccounts(accounts, {
      searchQuery: '',
      order: 'accountNameAZ',
      accountTypes: ['premium'],
      accountFeatures: [],
      accountAccess: [],
    });
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('premium');
  });

  it('should filter accounts by features (multiple features)', () => {
    const result = findAccounts(accounts, {
      searchQuery: '',
      order: 'accountNameAZ',
      accountTypes: [],
      accountFeatures: ['mobileAppBanking'],
      accountAccess: [],
    });
    expect(result.length).toBe(2);
    expect(result[0].features).toContain('mobileAppBanking');
    expect(result[1].features).toContain('mobileAppBanking');
  });

  it('should filter accounts by access', () => {
    const result = findAccounts(accounts, {
      searchQuery: '',
      order: 'accountNameAZ',
      accountTypes: [],
      accountFeatures: [],
      accountAccess: ['mobile'],
    });
    expect(result.length).toBe(2);
    expect(result[0].access).toContain('mobile');
    expect(result[1].access).toContain('mobile');
  });

  it('should return accounts with no filters applied', () => {
    const result = findAccounts(accounts, {
      searchQuery: '',
      order: 'accountNameAZ',
      accountTypes: [],
      accountFeatures: [],
      accountAccess: [],
    });
    expect(result.length).toBe(3);
  });

  it('should return an empty array when no accounts match the searchQuery', () => {
    const result = findAccounts(accounts, {
      searchQuery: 'Nonexistent Account',
      order: 'accountNameAZ',
      accountTypes: [],
      accountFeatures: [],
      accountAccess: [],
    });
    expect(result.length).toBe(0); // No match expected
  });

  it('should return all accounts when no filters are applied', () => {
    const result = findAccounts(accounts, {
      searchQuery: '',
      order: 'accountNameAZ',
      accountTypes: [],
      accountFeatures: [],
      accountAccess: [],
    });
    expect(result.length).toBe(3); // All accounts should be returned
  });

  it('should handle an empty list of accounts', () => {
    const result = findAccounts([], {
      searchQuery: '',
      order: 'accountNameAZ',
      accountTypes: [],
      accountFeatures: [],
      accountAccess: [],
    });
    expect(result.length).toBe(0); // No accounts should be returned
  });
});
