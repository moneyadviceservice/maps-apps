import { validateSalaryInput } from './validateSalaryInput';

describe('Validate Salary Input', () => {
  const cases = [
    {
      description: 'Should return no errors on successful validation',
      inputs: {
        grossIncome: '55000',
        grossIncomeFrequency: 'annual',
        pensionPercent: '5',
      },
      errors: undefined,
    },

    {
      description: 'Should return errors on unsuccessful validation',
      inputs: {
        grossIncome: 'abcdef',
      },
      errors: [
        {
          field: 'grossIncome',
          type: 'income-invalid',
        },
      ],
    },

    {
      description:
        'Should return errors on unsuccessful validation (hours per week lower)',
      inputs: {
        grossIncome: '55000',
        grossIncomeFrequency: 'hourly',
        hoursPerWeek: '0',
      },
      errors: [
        {
          field: 'hoursPerWeek',
          type: 'hours-per-week-range',
        },
      ],
    },

    {
      description:
        'Should return errors on unsuccessful validation (hours per week upper)',
      inputs: {
        grossIncome: '55000',
        grossIncomeFrequency: 'hourly',
        hoursPerWeek: '256',
      },
      errors: [
        {
          field: 'hoursPerWeek',
          type: 'hours-per-week-range',
        },
      ],
    },

    {
      description:
        'Should return errors on unsuccessful validation (days per week lower)',
      inputs: {
        grossIncome: '55000',
        grossIncomeFrequency: 'daily',
        daysPerWeek: '0',
      },
      errors: [
        {
          field: 'daysPerWeek',
          type: 'days-per-week-range',
        },
      ],
    },

    {
      description:
        'Should return errors on unsuccessful validation (days per week upper)',
      inputs: {
        grossIncome: '55000',
        grossIncomeFrequency: 'daily',
        daysPerWeek: '8',
      },
      errors: [
        {
          field: 'daysPerWeek',
          type: 'days-per-week-range',
        },
      ],
    },

    {
      description:
        'Should return errors on unsuccessful validation (pension percent)',
      inputs: {
        grossIncome: '55000',
        grossIncomeFrequency: 'annual',
        pensionPercent: '101',
      },
      errors: [
        {
          field: 'pensionPercent',
          type: 'pension-percent-range',
        },
      ],
    },

    {
      description:
        'Should return errors on unsuccessful validation (pension percent with invalid gross income)',
      inputs: {
        grossIncome: '',
        grossIncomeFrequency: 'annual',
        pensionPercent: '5',
      },
      errors: [
        {
          field: 'grossIncome',
          type: 'income-required',
        },
      ],
    },

    {
      description:
        'Should return errors on unsuccessful validation (pension fixed)',
      inputs: {
        grossIncome: '55000',
        grossIncomeFrequency: 'annual',
        pensionFixed: '90000',
      },
      errors: [
        {
          field: 'pensionFixed',
          type: 'pension-fixed-invalid',
        },
      ],
    },

    {
      description:
        'Should return errors on unsuccessful validation (pension fixed with invalid gross income)',
      inputs: {
        grossIncome: '',
        grossIncomeFrequency: 'annual',
        pensionFixed: '90000',
      },
      errors: [
        {
          field: 'grossIncome',
          type: 'income-required',
        },
      ],
    },
  ];

  describe('Validate inputs', () => {
    test.each(cases)('$description', ({ inputs, errors }) => {
      const result = validateSalaryInput(inputs);

      if (errors) {
        expect(result.errors).toStrictEqual(errors);
      } else {
        expect(result.errors).toBeUndefined();
      }
      expect(result.data).toStrictEqual(inputs);
    });
  });

  // Tax codes
  const validTaxCodes = [
    { taxCode: '1234L', isValid: true },
    { taxCode: 'S1234L', isValid: true },
    { taxCode: 'C1234L', isValid: true },

    { taxCode: '1234M', isValid: true },
    { taxCode: 'S1234M', isValid: true },
    { taxCode: 'C1234M', isValid: true },

    { taxCode: '1234N', isValid: true },
    { taxCode: 'S1234N', isValid: true },
    { taxCode: 'C1234N', isValid: true },

    { taxCode: '1234T', isValid: true },
    { taxCode: 'S1234T', isValid: true },
    { taxCode: 'C1234T', isValid: true },

    { taxCode: 'BR', isValid: true },
    { taxCode: 'SBR', isValid: true },
    { taxCode: 'CBR', isValid: true },

    { taxCode: 'D0', isValid: true },
    { taxCode: 'SD0', isValid: true },
    { taxCode: 'CD0', isValid: true },

    { taxCode: 'D1', isValid: true },
    { taxCode: 'SD1', isValid: true },
    { taxCode: 'CD1', isValid: true },

    { taxCode: 'SD2', isValid: true },

    { taxCode: 'SD3', isValid: true },

    { taxCode: 'K1234', isValid: true },
    { taxCode: 'SK1234', isValid: true },
    { taxCode: 'CK1234', isValid: true },

    { taxCode: 'NT', isValid: true },

    // W1 suffix
    { taxCode: '1234TW1', isValid: true },
    { taxCode: 'S1234TW1', isValid: true },
    { taxCode: 'C1234TW1', isValid: true },

    // M1 suffix
    { taxCode: '1234TM1', isValid: true },
    { taxCode: 'S1234TM1', isValid: true },
    { taxCode: 'C1234TM1', isValid: true },

    // X suffix
    { taxCode: '1234TX', isValid: true },
    { taxCode: 'S1234TX', isValid: true },
    { taxCode: 'C1234TX', isValid: true },
    { taxCode: 'NTX', isValid: true },

    // invalid
    { taxCode: '12345N', isValid: false },
    { taxCode: 'G1234N', isValid: false },
    { taxCode: 'C1234XXX', isValid: false },

    // with whitespace
    { taxCode: '1234 L', isValid: true },
    { taxCode: '12  57 L X', isValid: true },
  ];

  describe('Validate tax codes', () => {
    test.each(validTaxCodes)(
      'with taxcode $taxCode (valid = $isValid)',
      ({ taxCode, isValid }) => {
        const input = {
          grossIncome: '55000',
          grossIncomeFrequency: 'annual',
          taxCode,
        };

        const result = validateSalaryInput(input);

        if (isValid) {
          expect(result.errors).toBeUndefined();
        } else {
          expect(result.errors).toStrictEqual([
            { field: 'taxCode', type: 'tax-code-invalid' },
          ]);
        }
        expect(result.data).toStrictEqual(input);
      },
    );
  });
});
