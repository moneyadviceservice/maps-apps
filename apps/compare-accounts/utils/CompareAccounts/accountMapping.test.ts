import {
  accountTypeLabelFromDefaqtoAccountType,
  listAccountAccess,
  listAccountFeatures,
  listAccountTypes,
} from './accountMapping';

describe('account-mapping', () => {
  describe('listAccountTypes', () => {
    it('should return all account type labels', () => {
      const result = listAccountTypes();

      expect(result).toEqual([
        'standardCurrent',
        'feeFreeBasicBank',
        'student',
        'premier',
        'eMoney',
        'packaged',
        'childrenYoungPerson',
        'graduate',
        'feePayingAccount',
      ]);
    });

    it('should return array with correct length', () => {
      const result = listAccountTypes();
      expect(result).toHaveLength(9);
    });

    it('should return strings only', () => {
      const result = listAccountTypes();
      result.forEach((type) => {
        expect(typeof type).toBe('string');
      });
    });
  });

  describe('listAccountFeatures', () => {
    it('should return all account feature options', () => {
      const result = listAccountFeatures();

      expect(result).toEqual([
        'chequeBookAvailable',
        'noMonthlyFee',
        'openToNewCustomers',
        'overdraftFacilities',
        'sevenDaySwitching',
      ]);
    });

    it('should return array with correct length', () => {
      const result = listAccountFeatures();
      expect(result).toHaveLength(5);
    });

    it('should return strings only', () => {
      const result = listAccountFeatures();
      result.forEach((feature) => {
        expect(typeof feature).toBe('string');
      });
    });

    it('should include expected features', () => {
      const result = listAccountFeatures();
      expect(result).toContain('chequeBookAvailable');
      expect(result).toContain('noMonthlyFee');
      expect(result).toContain('openToNewCustomers');
      expect(result).toContain('overdraftFacilities');
      expect(result).toContain('sevenDaySwitching');
    });
  });

  describe('listAccountAccess', () => {
    it('should return all account access options', () => {
      const result = listAccountAccess();

      expect(result).toEqual([
        'branchBanking',
        'internetBanking',
        'mobileAppBanking',
        'postOfficeBanking',
      ]);
    });

    it('should return array with correct length', () => {
      const result = listAccountAccess();
      expect(result).toHaveLength(4);
    });

    it('should return strings only', () => {
      const result = listAccountAccess();
      result.forEach((access) => {
        expect(typeof access).toBe('string');
      });
    });

    it('should include expected access methods', () => {
      const result = listAccountAccess();
      expect(result).toContain('branchBanking');
      expect(result).toContain('internetBanking');
      expect(result).toContain('mobileAppBanking');
      expect(result).toContain('postOfficeBanking');
    });
  });

  describe('accountTypeLabelFromDefaqtoAccountType', () => {
    const validAccountTypeTestCases = [
      { input: 'standard', expected: 'standardCurrent' },
      { input: 'fee free basic account', expected: 'feeFreeBasicBank' },
      { input: 'Student', expected: 'student' },
      { input: 'premier', expected: 'premier' },
      { input: 'e-money account', expected: 'eMoney' },
      { input: 'added value', expected: 'packaged' },
      { input: 'young person', expected: 'childrenYoungPerson' },
      { input: 'graduate', expected: 'graduate' },
      { input: 'fee paying account', expected: 'feePayingAccount' },
    ];

    it.each(validAccountTypeTestCases)(
      'should return correct label for "$input" account type',
      ({ input, expected }) => {
        const result = accountTypeLabelFromDefaqtoAccountType(input);
        expect(result).toBe(expected);
      },
    );

    const errorTestCases = [
      { input: 'unknown type', description: 'unknown account type' },
      { input: '', description: 'empty string' },
      { input: null as any, description: 'null input' },
      { input: undefined as any, description: 'undefined input' },
      { input: 'STANDARD', description: 'case sensitive - uppercase' },
      { input: 'standard account', description: 'inexact string matching' },
    ];

    it.each(errorTestCases)(
      'should throw error for $description',
      ({ input }) => {
        expect(() => {
          accountTypeLabelFromDefaqtoAccountType(input);
        }).toThrow(`No label for Defaqto account type '${input}'`);
      },
    );
  });

  describe('consistency between functions', () => {
    it('should have accountTypeLabelFromDefaqtoAccountType return values that match listAccountTypes', () => {
      const accountTypes = listAccountTypes();
      const mappedTypes = [
        'standardCurrent',
        'feeFreeBasicBank',
        'student',
        'premier',
        'eMoney',
        'packaged',
        'childrenYoungPerson',
        'graduate',
        'feePayingAccount',
      ];

      mappedTypes.forEach((type) => {
        expect(accountTypes).toContain(type);
      });

      expect(accountTypes).toHaveLength(mappedTypes.length);
    });
  });
});
