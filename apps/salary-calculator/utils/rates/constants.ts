import type {
  EnglishTaxRates,
  ScottishTaxRates,
  SupportedEnglishTaxYear,
  SupportedScottishTaxYear,
} from './types';

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
    STUDENT_LOAN_PLAN_1_WEEKLY_THRESHOLD: 388,
    STUDENT_LOAN_PLAN_2_WEEKLY_THRESHOLD: 524,
    STUDENT_LOAN_PLAN_4_WEEKLY_THRESHOLD: 487.98,
    STUDENT_LOAN_PLAN_5_WEEKLY_THRESHOLD: 480, // Note: this was only introduced in 2023/24, so technically isn't relevant to 22/23
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1 or 2 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_WEEKLY_THRESHOLD: 403.84,
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
    STUDENT_LOAN_PLAN_1_WEEKLY_THRESHOLD: 423,
    STUDENT_LOAN_PLAN_2_WEEKLY_THRESHOLD: 524,
    STUDENT_LOAN_PLAN_4_WEEKLY_THRESHOLD: 532,
    STUDENT_LOAN_PLAN_5_WEEKLY_THRESHOLD: 480,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_WEEKLY_THRESHOLD: 403,
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
    STUDENT_LOAN_PLAN_1_WEEKLY_THRESHOLD: 480.57,
    STUDENT_LOAN_PLAN_2_WEEKLY_THRESHOLD: 524.9,
    STUDENT_LOAN_PLAN_4_WEEKLY_THRESHOLD: 531.92,
    STUDENT_LOAN_PLAN_5_WEEKLY_THRESHOLD: 480,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_WEEKLY_THRESHOLD: 403.84,
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
    STUDENT_LOAN_PLAN_1_WEEKLY_THRESHOLD: 501,
    STUDENT_LOAN_PLAN_2_WEEKLY_THRESHOLD: 547,
    STUDENT_LOAN_PLAN_4_WEEKLY_THRESHOLD: 629,
    STUDENT_LOAN_PLAN_5_WEEKLY_THRESHOLD: 480,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_WEEKLY_THRESHOLD: 403,
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
    STUDENT_LOAN_PLAN_1_WEEKLY_THRESHOLD: 480.57,
    STUDENT_LOAN_PLAN_2_WEEKLY_THRESHOLD: 524.9,
    STUDENT_LOAN_PLAN_4_WEEKLY_THRESHOLD: 531.92,
    STUDENT_LOAN_PLAN_5_WEEKLY_THRESHOLD: 480,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_WEEKLY_THRESHOLD: 403.84,
    STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD: 0.06, // People on postgrad plans repay 6% of the amount you earn over the threshold
    // National Insurance
    NI_MIDDLE_RATE: 0.08,
    NI_UPPER_RATE: 0.02,
    NI_MIDDLE_BRACKET: 242,
    NI_UPPER_BRACKET: 967,
    NI_ANNUAL_MIDDLE_BRACKET: 12_570, //
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
    STUDENT_LOAN_PLAN_1_WEEKLY_THRESHOLD: 501,
    STUDENT_LOAN_PLAN_2_WEEKLY_THRESHOLD: 547,
    STUDENT_LOAN_PLAN_4_WEEKLY_THRESHOLD: 629,
    STUDENT_LOAN_PLAN_5_WEEKLY_THRESHOLD: 480,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0.09, // People on plans 1, 2, 4 + 5 repay 9% of the amount you earn over the threshold
    STUDENT_LOAN_POSTGRAD_WEEKLY_THRESHOLD: 403,
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
