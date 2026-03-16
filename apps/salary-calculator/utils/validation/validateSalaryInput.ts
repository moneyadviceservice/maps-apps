import { getMonthlyGrossIncome } from 'utils/errors/utils';
import { transformTaxCode } from 'utils/helpers/transformTaxCode';
import { z } from 'zod';

const Currency = (value: string) => Number(value.replaceAll(',', ''));
const EmptyString = (value: string | null | undefined) =>
  value === '' ? undefined : value;

const IncomeRequired = { error: 'income-required' };
const IncomeInvalid = { error: 'income-invalid' };
const IncomeFrequencyInvalid = { error: 'income-frequency-invalid' };
const IsScottishInvalid = { error: 'is-scottish-invalid' };
const HoursPerWeekInvalid = { error: 'hours-per-week-invalid' };
const DaysPerWeekInvalid = { error: 'days-per-week-invalid' };
const TaxCodeInvalid = { error: 'tax-code-invalid' };
const PensionPercentInvalid = { error: 'pension-percent-invalid' };
const PensionFixedInvalid = { error: 'pension-fixed-invalid' };
const IsBlindPersonInvalid = { error: 'is-blind-person-invalid' };
const IsOverStatePensionAgeInvalid = { error: 'is-over-state-pension-invalid' };
const Plan1Invalid = { error: 'plan1-invalid' };
const Plan2Invalid = { error: 'plan2-invalid' };
const Plan4Invalid = { error: 'plan4-invalid' };
const Plan5Invalid = { error: 'plan5-invalid' };
const PlanPostGradInvalid = { error: 'plan-post-grad-invalid' };
const CalculationTypeInvalid = { error: 'calculation-type-invalid' };

const schema = z
  .object({
    grossIncome: z
      .string(IncomeRequired)
      .nonempty(IncomeRequired)
      .transform(Currency)
      .pipe(z.number(IncomeInvalid)),
    grossIncomeFrequency: z
      .string()
      .nullish()
      .transform(EmptyString)
      .pipe(
        z
          .enum(
            ['annual', 'monthly', 'weekly', 'daily', 'hourly'],
            IncomeFrequencyInvalid,
          )
          .default('annual'),
      ),
    isScottishResident: z
      .string()
      .transform(EmptyString)
      .default('false')
      .pipe(z.stringbool(IsScottishInvalid)),
    hoursPerWeek: z
      .string(HoursPerWeekInvalid)
      .optional()
      .transform((value) => (value?.trim() === '' ? undefined : Number(value))),
    daysPerWeek: z
      .string(DaysPerWeekInvalid)
      .optional()
      .transform((value) => (value?.trim() === '' ? undefined : Number(value))),
    taxCode: z
      .string(TaxCodeInvalid)
      .transform(transformTaxCode)
      .default('1257L'),
    pensionPercent: z
      .string(PensionPercentInvalid)
      .optional()
      .transform((v) => (v ? Currency(v) : 0))
      .pipe(z.number(PensionPercentInvalid)),
    pensionFixed: z
      .string(PensionFixedInvalid)
      .optional()
      .transform((v) => (v ? Currency(v) : 0))
      .pipe(z.number(PensionFixedInvalid)),
    isBlindPerson: z
      .string()
      .transform(EmptyString)
      .default('false')
      .pipe(z.stringbool(IsBlindPersonInvalid)),
    isOverStatePensionAge: z
      .string()
      .transform(EmptyString)
      .default('false')
      .pipe(z.stringbool(IsOverStatePensionAgeInvalid)),
    plan1: z
      .string()
      .transform(EmptyString)
      .default('false')
      .pipe(z.stringbool(Plan1Invalid)),
    plan2: z
      .string()
      .transform(EmptyString)
      .default('false')
      .pipe(z.stringbool(Plan2Invalid)),
    plan4: z
      .string()
      .transform(EmptyString)
      .default('false')
      .pipe(z.stringbool(Plan4Invalid)),
    plan5: z
      .string()
      .transform(EmptyString)
      .default('false')
      .pipe(z.stringbool(Plan5Invalid)),
    planPostGrad: z
      .string()
      .transform(EmptyString)
      .default('false')
      .pipe(z.stringbool(PlanPostGradInvalid)),
    calculationType: z
      .string()
      .nullish()
      .transform(EmptyString)
      .pipe(
        z.enum(['single', 'joint'], CalculationTypeInvalid).default('single'),
      ),
  })

  // Expect daysPerWeek if income frequency is daily
  .refine(
    (data) => {
      // Invalid if blank for daily frequency
      if (data.grossIncomeFrequency === 'daily') {
        return data.daysPerWeek !== undefined;
      }
      return true;
    },
    { message: 'days-per-week-invalid', path: ['daysPerWeek'] },
  )
  .refine(
    (data) => {
      // range error only if a number is present but out of range
      if (
        data.grossIncomeFrequency === 'daily' &&
        data.daysPerWeek !== undefined
      ) {
        return data.daysPerWeek >= 1 && data.daysPerWeek <= 7;
      }
      return true;
    },
    { message: 'days-per-week-range', path: ['daysPerWeek'] },
  )

  // Expect hoursPerWeek if income is hourly
  .refine(
    (data) => {
      // Invalid if blank for hourly frequency
      if (data.grossIncomeFrequency === 'hourly') {
        return data.hoursPerWeek !== undefined;
      }
      return true;
    },
    { message: 'hours-per-week-invalid', path: ['hoursPerWeek'] },
  )
  .refine(
    (data) => {
      // Range only if a number is present
      if (
        data.grossIncomeFrequency === 'hourly' &&
        data.hoursPerWeek !== undefined
      ) {
        return data.hoursPerWeek >= 1 && data.hoursPerWeek <= 168;
      }
      return true;
    },
    { message: 'hours-per-week-range', path: ['hoursPerWeek'] },
  )

  // Only allow pension percent OR pension fixed, not both
  .refine((data) => !(data.pensionPercent > 0 && data.pensionFixed > 0), {
    message: 'pension-contributions-invalid',
    path: ['pensionContributions'],
  })
  // Only allow pension percent contributions less than or equal to 100%
  .refine(
    (data) => {
      if (typeof data.grossIncome === 'number') {
        return data.pensionPercent <= 100;
      }
      return true;
    },
    {
      message: 'pension-percent-range',
      path: ['pensionPercent'],
    },
  )

  // Only allow fixed pension contribution less than gross income
  .refine(
    (data) => {
      // skip validation if pensionFixed is not set or grossIncome is invalid
      if (
        !data.pensionFixed ||
        !data.grossIncome ||
        !data.grossIncomeFrequency
      ) {
        return true;
      }

      const monthlyIncome = getMonthlyGrossIncome(data);

      if (!monthlyIncome) return true;

      // check if fixed pension is less than monthly income
      return data.pensionFixed < monthlyIncome;
    },
    {
      message: 'pension-fixed-invalid',
      path: ['pensionFixed'],
    },
  )
  // Tax code validation
  .refine(
    (data) => {
      if (data.taxCode !== '') {
        return (
          /^([SC]?(\d{1,4}|\d{1,4}[LMNT])(W1|M1|X)?)$/.test(data.taxCode) ||
          /^([SC]?K(\d{1,4})(W1|M1|X)?)$/.test(data.taxCode) ||
          /^([SC]?(BR|D0|D1)(W1|M1|X)?)$/.test(data.taxCode) ||
          /^((SD2|SD3|NT)(W1|M1|X)?)$/.test(data.taxCode)
        );
      }

      return true;
    },
    {
      message: 'tax-code-invalid',
      path: ['taxCode'],
    },
  );

export interface SalaryFormInput {
  grossIncome: string;
  grossIncomeFrequency?: string;
  isScottishResident?: string;
  hoursPerWeek?: string;
  daysPerWeek?: string;
  taxCode?: string;
  pensionPercent?: string;
  pensionFixed?: string;
  isBlindPerson?: string;
  isOverStatePensionAge?: string;
  plan1?: string;
  plan2?: string;
  plan4?: string;
  plan5?: string;
  planPostGrad?: string;
  calculationType?: string;
}

export interface FieldError {
  field: string;
  type: string;
}

interface ValidationResult {
  errors?: FieldError[];
  data: SalaryFormInput;
}

export const validateSalaryInput = (
  salaryInput: SalaryFormInput,
): ValidationResult => {
  const validationResult: ValidationResult = {
    data: salaryInput,
  };

  const parseResult = schema.safeParse(salaryInput);

  if (!parseResult.success) {
    validationResult.errors = parseResult.error.issues.map((issue) => ({
      field: issue.path[0] as string,
      type: issue.message,
    }));
  }

  return validationResult;
};
