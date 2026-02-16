import useTranslation from '@maps-react/hooks/useTranslation';
import { errorMessages } from './messages';
import { getErrorMessage, parseErrors } from './utils';
import { SalaryFormData } from 'components/SalaryForm';

type TranslationFunction = ReturnType<typeof useTranslation>['z'];

const mockZ: TranslationFunction = ((translations: any) => {
  if (typeof translations === 'object' && 'en' in translations) {
    return translations.en;
  }
  return translations;
}) as TranslationFunction;

describe('Parse Errors JSON', () => {
  it('Should return undefined if invalid json', () => {
    expect(parseErrors('not json', mockZ)).toBeUndefined();
  });

  it('Should return undefined if no errors', () => {
    expect(parseErrors(undefined, mockZ)).toBeUndefined();
  });

  it('Should return empty object if no array in json', () => {
    const result = parseErrors('{}', mockZ);
    expect(result && Object.keys(result).length).toEqual(0);
  });

  it('Should return empty object if no errors in json', () => {
    const result = parseErrors('[]', mockZ);
    expect(result && Object.keys(result).length).toEqual(0);
  });

  it('Should not add invalid errors to result', () => {
    const result = parseErrors('[{}]', mockZ);
    expect(result && Object.keys(result).length).toEqual(0);
  });

  it('Should add valid errors to result', () => {
    const result = parseErrors(
      '[{}, {"field": "grossIncome", "type": "income-required"}]',
      mockZ,
    );
    expect(result && Object.keys(result).length).toEqual(1);
  });

  it('Should append monthly gross income for pension-fixed-invalid error', () => {
    const salary1: SalaryFormData = {
      grossIncome: '60000',
      grossIncomeFrequency: 'annual',
      daysPerWeek: '',
      hoursPerWeek: '',
      taxCode: '1257L',
      isScottishResident: false,
      country: 'England/NI/Wales',
      pensionValue: 9000,
      pensionType: 'percentage',
      isBlindPerson: false,
      isOverStatePensionAge: false,
      studentLoans: {
        plan1: false,
        plan2: false,
        plan4: false,
        plan5: false,
        planPostGrad: false,
      },
      calculated: false,
    };

    const result = parseErrors(
      '[{ "field": "pensionFixed", "type": "pension-fixed-invalid" }]',
      mockZ,
      salary1,
    );

    const message = result?.pensionFixed?.[0];
    if (!message) throw new Error('Expected pensionFixed message');

    expect(message).toMatch(/£\d+\.\d{2}/); // checks for £NNNN.NN
  });

  it('Should ignore errors with unknown field', () => {
    const result = parseErrors(
      '[{ "field": "unknownField", "type": "income-required" }]',
      mockZ,
    );
    expect(result).toEqual({});
  });
  it('Should not append monthly income if salary is missing', () => {
    const result = parseErrors(
      '[{ "field": "pensionFixed", "type": "pension-fixed-invalid" }]',
      mockZ,
    );

    const message = result?.pensionFixed?.[0];
    if (!message) throw new Error('Expected pensionFixed message');

    expect(message).not.toMatch(/£\d+\.\d{2}/);
  });

  it('Should not append monthly income if salary is missing gross income', () => {
    const salary1 = {
      grossIncome: '',
      grossIncomeFrequency: 'annual',
    } as SalaryFormData;

    const result = parseErrors(
      '[{ "field": "pensionFixed", "type": "pension-fixed-invalid" }]',
      mockZ,
      salary1,
    );

    const message = result?.pensionFixed?.[0];
    if (!message) throw new Error('Expected pensionFixed message');

    expect(message).not.toContain('£');
  });

  it('Should use salary2 for salary2 pension errors', () => {
    const salary2: SalaryFormData = {
      grossIncome: '120000',
      grossIncomeFrequency: 'annual',
      daysPerWeek: '',
      hoursPerWeek: '',
      taxCode: '1257L',
      isScottishResident: false,
      country: 'England/NI/Wales',
      pensionValue: 10000,
      pensionType: 'percentage',
      isBlindPerson: false,
      isOverStatePensionAge: false,
      studentLoans: {
        plan1: false,
        plan2: false,
        plan4: false,
        plan5: false,
        planPostGrad: false,
      },
      calculated: false,
    };

    const result = parseErrors(
      '[{ "field": "salary2_pensionFixed", "type": "pension-fixed-invalid" }]',
      mockZ,
      undefined,
      salary2,
    );

    const message = result?.salary2_pensionFixed?.[0];
    if (!message) throw new Error('Expected salary2_pensionFixed message');

    expect(message).toMatch(/£\d+\.\d{2}/);
  });
});

describe('getErrorMessage', () => {
  it('removes {salary2} when isSalary2 is false', () => {
    const result = getErrorMessage('days-per-week-invalid', mockZ, false);

    expect(result).toBe('Enter the number of days a week you work');
    expect(result).not.toContain('{salary2}');
  });

  it('inserts "for salary 2" when isSalary2 is true', () => {
    const result = getErrorMessage('days-per-week-invalid', mockZ, true);

    expect(result).toBe(
      'Enter the number of days a week you work for salary 2',
    );
  });

  it('places salary2 text in the middle of the sentence when required', () => {
    const result = getErrorMessage('days-per-week-range', mockZ, true);

    expect(result).toBe('Enter a number for salary 2 between 1 and 7');
  });

  it('adds salary2 suffix for income-required only when isSalary2 is true', () => {
    const resultFalse = getErrorMessage('income-required', mockZ, false);
    expect(resultFalse).toBe('Enter your gross salary');
    expect(resultFalse).not.toContain('2');

    const resultTrue = getErrorMessage('income-required', mockZ, true);
    expect(resultTrue).toBe('Enter your gross salary 2');
    expect(resultTrue).toContain(' 2');
  });

  it('never leaks the {salary2} placeholder', () => {
    Object.keys(errorMessages).forEach((key) => {
      const result = getErrorMessage(
        key as keyof typeof errorMessages,
        mockZ,
        true,
      );

      expect(result).not.toContain('{salary2}');
    });
  });
});
