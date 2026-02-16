import type {
  EnglishTaxRates,
  ScottishTaxRates,
  SupportedEnglishTaxYear,
  SupportedScottishTaxYear,
} from './types';

export const DEFAULT_TAX_CODE_ENGLAND = '1257L';
export const DEFAULT_TAX_CODE_SCOTLAND = 'S1257';

/**
 * Special tax codes for England, Wales, and NI.
 * These codes override standard banded calculation and apply a flat rate to all taxable income.
 * See: https://www.gov.uk/tax-codes
 */
export const SPECIAL_TAX_CODES_ENGLAND: Record<string, number> = {
  BR: 0.2, // "Basic Rate" - All income taxed at 20%, no personal allowance.
  D0: 0.4, // "Higher Rate" - All income taxed at 40%, no personal allowance.
  D1: 0.45, // "Additional Rate" - All income taxed at 45%, no personal allowance.
  NT: 0, // "No Tax" - No income tax deducted from income.
  CBR: 0.2, // "C" prefix = Wales. All income taxed at 20%, no personal allowance (Welsh code, same as BR).
  CD0: 0.4, // "C" prefix = Wales. All income taxed at 40%, no personal allowance (Welsh code, same as D0).
  CD1: 0.45, // "C" prefix = Wales. All income taxed at 45%, no personal allowance (Welsh code, same as D1).
};

/**
 * Special tax codes for Scotland.
 * These codes override standard banded calculation and apply a flat rate to all taxable income.
 * See: https://www.gov.uk/tax-codes
 */
export const SPECIAL_TAX_CODES_SCOTLAND: Record<string, number> = {
  SBR: 0.2, // "Scottish Basic Rate" - All income taxed at 20%, no personal allowance.
  SD0: 0.21, // "Scottish Intermediate Rate" - All income taxed at 21%, no personal allowance.
  SD1: 0.42, // "Scottish Higher Rate" - All income taxed at 42%, no personal allowance.
  SD2: 0.45, // "Scottish Advanced Rate" - All income taxed at 45%, no personal allowance.
  SD3: 0.48, // "Scottish Top Rate" - All income taxed at 48%, no personal allowance.
  D0: 0.21, // "D0" - All income taxed at Scottish Intermediate Rate (21%), no personal allowance.
  D1: 0.42, // "D1" - All income taxed at Scottish Higher Rate (42%), no personal allowance.
  D2: 0.45, // "D2" - All income taxed at Scottish Advanced Rate (45%), no personal allowance.
  D3: 0.48, // "D3" - All income taxed at Scottish Top Rate (48%), no personal allowance.
  NT: 0, // "No Tax" - No income tax deducted from income.
};

export const englandNiWalesTaxRates: Record<
  SupportedEnglishTaxYear,
  EnglishTaxRates
> = {
  // As of 6th July 2022 (NICs change applied)
  // Change described here: https://www.gov.uk/guidance/estimate-how-the-national-insurance-contributions-changes-will-affect-you
  '2022/23': {
    COUNTRY: 'England/NI/Wales',
    // Income tax
    DEFAULT_PERSONAL_ALLOWANCE: 12_570,
    HIGHER_BRACKET: 50_270,
    ADDITIONAL_BRACKET: 150_000,
    BASIC_RATE: 0.2,
    HIGHER_RATE: 0.4,
    ADDITIONAL_RATE: 0.45,
    PERSONAL_ALLOWANCE_DROPOFF: 100_000,
    // Student loan repayments
    STUDENT_LOAN_PLAN_1_YEARLY_THRESHOLD: 20_195,
    STUDENT_LOAN_PLAN_2_YEARLY_THRESHOLD: 27_295,
    STUDENT_LOAN_PLAN_4_YEARLY_THRESHOLD: 25_375,
    STUDENT_LOAN_PLAN_5_YEARLY_THRESHOLD: 25_000, // Note: this was only introduced in 2023/24, so technically isn't relevant to 22/23
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1 or 2 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_YEARLY_THRESHOLD: 21_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD: 0.06, // People on postgrad plans repay 6% of the amount you earn over the threshold
    // National Insurance
    NI_MIDDLE_RATE: 0.1325,
    NI_UPPER_RATE: 0.0325,
    NI_MIDDLE_BRACKET: 242,
    NI_UPPER_BRACKET: 967,
    NI_ANNUAL_MIDDLE_BRACKET: 12_570, // 242 * 52 = 12,584, but HMRC uses 12,570
    NI_ANNUAL_UPPER_BRACKET: 50_270,
    // Pension allowances
    PENSION_ANNUAL_ALLOWANCE: 40_000,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 4000,
    PENSION_ADJUSTED_LIMIT: 240_000,
    // Blind persons's allowance
    BLIND_PERSONS_ALLOWANCE: 2_600,
  },
  '2023/24': {
    COUNTRY: 'England/NI/Wales',
    // Income tax
    DEFAULT_PERSONAL_ALLOWANCE: 12_570,
    HIGHER_BRACKET: 50_270,
    ADDITIONAL_BRACKET: 125_140,
    BASIC_RATE: 0.2,
    HIGHER_RATE: 0.4,
    ADDITIONAL_RATE: 0.45,
    PERSONAL_ALLOWANCE_DROPOFF: 100_000,
    // Student loan repayments
    STUDENT_LOAN_PLAN_1_YEARLY_THRESHOLD: 22_015,
    STUDENT_LOAN_PLAN_2_YEARLY_THRESHOLD: 27_295,
    STUDENT_LOAN_PLAN_4_YEARLY_THRESHOLD: 27_660,
    STUDENT_LOAN_PLAN_5_YEARLY_THRESHOLD: 25_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_YEARLY_THRESHOLD: 21_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD: 0.06, // People on postgrad plans repay 6% of the amount you earn over the threshold
    // National Insurance
    NI_MIDDLE_RATE: 0.1, // Changed from 12% to 10% on 6th Jan 2024 (out of normal cycle)
    NI_UPPER_RATE: 0.02,
    NI_MIDDLE_BRACKET: 242,
    NI_UPPER_BRACKET: 967,
    NI_ANNUAL_MIDDLE_BRACKET: 12_570, // 242 * 52 = 12,584, but HMRC uses 12,570
    NI_ANNUAL_UPPER_BRACKET: 50_270,
    // Pension allowances
    PENSION_ANNUAL_ALLOWANCE: 60_000,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 10_000,
    PENSION_ADJUSTED_LIMIT: 260_000,
    // Blind persons's allowance
    BLIND_PERSONS_ALLOWANCE: 2_870,
  },
  '2024/25': {
    COUNTRY: 'England/NI/Wales',
    // Income tax
    DEFAULT_PERSONAL_ALLOWANCE: 12_570,
    HIGHER_BRACKET: 50_270,
    ADDITIONAL_BRACKET: 125_140,
    BASIC_RATE: 0.2,
    HIGHER_RATE: 0.4,
    ADDITIONAL_RATE: 0.45,
    PERSONAL_ALLOWANCE_DROPOFF: 100_000,
    // Student loan repayments
    STUDENT_LOAN_PLAN_1_YEARLY_THRESHOLD: 24_990,
    STUDENT_LOAN_PLAN_2_YEARLY_THRESHOLD: 27_295,
    STUDENT_LOAN_PLAN_4_YEARLY_THRESHOLD: 31_395,
    STUDENT_LOAN_PLAN_5_YEARLY_THRESHOLD: 25_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_YEARLY_THRESHOLD: 21_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD: 0.06, // People on postgrad plans repay 6% of the amount you earn over the threshold
    // National Insurance
    NI_MIDDLE_RATE: 0.08,
    NI_UPPER_RATE: 0.02,
    NI_MIDDLE_BRACKET: 242,
    NI_UPPER_BRACKET: 967,
    NI_ANNUAL_MIDDLE_BRACKET: 12_570, // 242 * 52 = 12,584, but HMRC uses 12,570
    NI_ANNUAL_UPPER_BRACKET: 50_270,
    // Pension allowances
    PENSION_ANNUAL_ALLOWANCE: 60_000,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 10_000,
    PENSION_ADJUSTED_LIMIT: 260_000,
    // Blind persons's allowance
    BLIND_PERSONS_ALLOWANCE: 3_070,
  },
  '2025/26': {
    COUNTRY: 'England/NI/Wales',
    // Income tax
    DEFAULT_PERSONAL_ALLOWANCE: 12_570,
    HIGHER_BRACKET: 50_270,
    ADDITIONAL_BRACKET: 125_140,
    BASIC_RATE: 0.2,
    HIGHER_RATE: 0.4,
    ADDITIONAL_RATE: 0.45,
    PERSONAL_ALLOWANCE_DROPOFF: 100_000,
    // Student loan repayments
    STUDENT_LOAN_PLAN_1_YEARLY_THRESHOLD: 26_065,
    STUDENT_LOAN_PLAN_2_YEARLY_THRESHOLD: 28_470,
    STUDENT_LOAN_PLAN_4_YEARLY_THRESHOLD: 32_745,
    STUDENT_LOAN_PLAN_5_YEARLY_THRESHOLD: 25_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_YEARLY_THRESHOLD: 21_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD: 0.06, // People on postgrad plans repay 6% of the amount you earn over the threshold
    // National Insurance
    NI_MIDDLE_RATE: 0.08,
    NI_UPPER_RATE: 0.02,
    NI_MIDDLE_BRACKET: 242,
    NI_UPPER_BRACKET: 967,
    NI_ANNUAL_MIDDLE_BRACKET: 12_570, // 242 * 52 = 12,584, but HMRC uses 12,570
    NI_ANNUAL_UPPER_BRACKET: 50_270,
    // Pension allowances
    PENSION_ANNUAL_ALLOWANCE: 60_000,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 10_000,
    PENSION_ADJUSTED_LIMIT: 260_000,
    // Blind persons's allowance
    BLIND_PERSONS_ALLOWANCE: 3_130,
  },
};

export const scottishTaxRates: Record<
  SupportedScottishTaxYear,
  ScottishTaxRates
> = {
  // As of 7th April 2024
  '2024/25': {
    COUNTRY: 'Scotland',

    // Income tax
    DEFAULT_PERSONAL_ALLOWANCE: 12_570,

    STARTER_RATE: 0.19,
    BASIC_BRACKET: 14_877,
    BASIC_RATE: 0.2,
    INTERMEDIATE_BRACKET: 26_562,
    INTERMEDIATE_RATE: 0.21,
    HIGHER_BRACKET: 43_663,
    HIGHER_RATE: 0.42,
    ADVANCED_BRACKET: 75_001,
    ADVANCED_RATE: 0.45,
    TOP_BRACKET: 125_140,
    TOP_RATE: 0.48,

    PERSONAL_ALLOWANCE_DROPOFF: 100_000,
    // Student loan repayments
    STUDENT_LOAN_PLAN_1_YEARLY_THRESHOLD: 24_990,
    STUDENT_LOAN_PLAN_2_YEARLY_THRESHOLD: 27_295,
    STUDENT_LOAN_PLAN_4_YEARLY_THRESHOLD: 31_395,
    STUDENT_LOAN_PLAN_5_YEARLY_THRESHOLD: 25_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_YEARLY_THRESHOLD: 21_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD: 0.06, // People on postgrad plans repay 6% of the amount you earn over the threshold
    // National Insurance
    NI_MIDDLE_RATE: 0.08,
    NI_UPPER_RATE: 0.02,
    NI_MIDDLE_BRACKET: 242,
    NI_UPPER_BRACKET: 967,
    NI_ANNUAL_MIDDLE_BRACKET: 12_570,
    NI_ANNUAL_UPPER_BRACKET: 50_270,
    // Pension allowances
    PENSION_ANNUAL_ALLOWANCE: 60_000,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 10_000,
    PENSION_ADJUSTED_LIMIT: 260_000,
    // Blind persons's allowance
    BLIND_PERSONS_ALLOWANCE: 3_070,
  },
  '2025/26': {
    COUNTRY: 'Scotland',

    // Income tax
    DEFAULT_PERSONAL_ALLOWANCE: 12_570,

    STARTER_RATE: 0.19,
    BASIC_BRACKET: 15_398,
    BASIC_RATE: 0.2,
    INTERMEDIATE_BRACKET: 27_492,
    INTERMEDIATE_RATE: 0.21,
    HIGHER_BRACKET: 43_663,
    HIGHER_RATE: 0.42,
    ADVANCED_BRACKET: 75_001,
    ADVANCED_RATE: 0.45,
    TOP_BRACKET: 125_140,
    TOP_RATE: 0.48,

    PERSONAL_ALLOWANCE_DROPOFF: 100_000,
    // Student loan repayments
    STUDENT_LOAN_PLAN_1_YEARLY_THRESHOLD: 26_065,
    STUDENT_LOAN_PLAN_2_YEARLY_THRESHOLD: 28_470,
    STUDENT_LOAN_PLAN_4_YEARLY_THRESHOLD: 32_745,
    STUDENT_LOAN_PLAN_5_YEARLY_THRESHOLD: 25_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_YEARLY_THRESHOLD: 21_000,
    STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD: 0.06, // People on postgrad plans repay 6% of the amount you earn over the threshold
    // National Insurance
    NI_MIDDLE_RATE: 0.08,
    NI_UPPER_RATE: 0.02,
    NI_MIDDLE_BRACKET: 242,
    NI_UPPER_BRACKET: 967,
    NI_ANNUAL_MIDDLE_BRACKET: 12_570, // 242 * 52 = 12,584, but HMRC uses 12,570
    NI_ANNUAL_UPPER_BRACKET: 50_270,
    // Pension allowances
    PENSION_ANNUAL_ALLOWANCE: 60_000,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 10_000,
    PENSION_ADJUSTED_LIMIT: 260_000,
    // Blind persons's allowance
    BLIND_PERSONS_ALLOWANCE: 3_130,
  },
};
