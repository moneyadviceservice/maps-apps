import { getSalaryTrackingData, formatTaxCode } from './getSalaryTrackingData';

describe('getSalaryTrackingData', () => {
  const baseTitle = 'Salary Calculator';

  it('should return correct tracking for step 1 (no results)', () => {
    const data = getSalaryTrackingData({
      salary1: {
        taxCode: '1257L',
        grossIncome: '30000',
        isBlindPerson: false,
        isOverStatePensionAge: false,
      },
      calculationType: 'single',
      hasResults: false, // no results
      title: baseTitle,
    });
    expect(data.tool.toolStep).toBe('1');
    expect(data.tool.stepName).toBe('Salary Calculator - start');
    expect(data.tool.outcome).toBeUndefined();
    expect(data.demo).toBeUndefined();
  });

  it('should handle recalculated results', () => {
    const data = getSalaryTrackingData({
      salary1: {
        taxCode: '1257L',
        grossIncome: '30000',
        isBlindPerson: true,
        isOverStatePensionAge: false,
      },
      calculationType: 'single',
      hasResults: true,
      recalculated: true,
      title: baseTitle,
    });

    expect(data.tool.toolStep).toBe('2.5');
    expect(data.tool.stepName).toContain('recalculated');
    expect(data.tool.outcome?.benefit).toBe('Blind person allowance');
    expect(data.tool.outcome?.otherSupport).toBe('L');
    expect(data.demo?.bYear).toBe('');
  });

  it('should handle joint calculation with Scottish codes', () => {
    const data = getSalaryTrackingData({
      salary1: {
        taxCode: 'S1373M',
        grossIncome: '40000',
        isBlindPerson: false,
        isOverStatePensionAge: false,
      },
      salary2: {
        taxCode: 'S50T',
        grossIncome: '30000',
        isBlindPerson: true,
        isOverStatePensionAge: false,
      },
      calculationType: 'joint',
      hasResults: true,
      title: baseTitle,
    });

    expect(data.tool.toolStep).toBe('2');
    expect(data.tool.outcome).toBeDefined();
    expect(data.tool.outcome?.otherSupport).toBe('S#M');
    expect(data.tool.outcome?.benefit).toBe('Blind person allowance');
  });

  it('should include bYear and emolument when over state pension age', () => {
    const data = getSalaryTrackingData({
      salary1: {
        taxCode: '1257L',
        grossIncome: '30000',
        isBlindPerson: false,
        isOverStatePensionAge: true,
      },
      calculationType: 'single',
      hasResults: true,
      title: baseTitle,
    });

    expect(data.demo?.bYear).toBe('66+');
    expect(data.demo?.emolument).toBe(30); // 30000 / 1000
  });

  it('should handle emergency codes correctly', () => {
    const codes = ['M1', 'W1', 'X'];
    for (const code of codes) {
      const data = getSalaryTrackingData({
        salary1: {
          taxCode: `1257L${code}`,
          grossIncome: '30000',
          isBlindPerson: false,
          isOverStatePensionAge: false,
        },
        calculationType: 'single',
        hasResults: true,
        title: baseTitle,
      });
      expect(data.tool.outcome).toBeDefined();
      expect(data.tool.outcome!.otherSupport).toBe(`L#${code}`);
    }
  });

  it('should handle K codes', () => {
    const data = getSalaryTrackingData({
      salary1: {
        taxCode: 'K475',
        grossIncome: '30000',
        isBlindPerson: false,
        isOverStatePensionAge: false,
      },
      calculationType: 'single',
      hasResults: true,
      title: baseTitle,
    });

    expect(data.tool.outcome!.otherSupport).toBe('K');
  });
});

describe('formatTaxCode - plain codes', () => {
  const testCases = [
    { input: '1257L', expected: 'L' },
    { input: 'S1257L', expected: 'S#L' },
    { input: '1257T', expected: 'T' },
    { input: 'S1373M', expected: 'S#M' },
    { input: '1100T', expected: 'T' },
    { input: 'S50T', expected: 'S#T' },
    { input: 'SK475', expected: 'S#K' },
    { input: 'K475', expected: 'K' },
    { input: 'BR', expected: 'BR' },
    { input: '0T', expected: '0T' },
    { input: 'S0T', expected: 'S#0T' },
    { input: 'D0', expected: 'D0' },
    { input: 'D1', expected: 'D1' },
    { input: 'K497', expected: 'K' },
    { input: 'SD0', expected: 'S#D0' },
    { input: 'SD1', expected: 'S#D1' },
    { input: 'C1257L', expected: 'C#L' },
    { input: 'S1257W1', expected: 'S#W1' },
    { input: 'S1257LM1', expected: 'S#LM1' },
    { input: '1257LX', expected: 'L#X' },
    { input: 'S1257X', expected: 'S#X' },
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should convert "${input}" to "${expected}"`, () => {
      expect(formatTaxCode(input)).toBe(expected);
    });
  });
});
