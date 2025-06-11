export const QUESTION_PREFIX = 'q-';
export const SUBMIT_ANSWER_API = '/api/form-actions/submit-answer';
export const CHANGE_ANSWER_API = '/api/form-actions/change-answer';
export const CHANGE_ANSWER_PARAM = 'changeAnswer';
export const DATA_PATH = '';

export const WEEKLY_PAY_CAP_PRE_2025 = 700.0;
export const WEEKLY_PAY_CAP_NI_PRE_2025 = 729.0;
export const WEEKLY_PAY_CAP = 719.0;
export const WEEKLY_PAY_CAP_NI = 749.0;
export const MINIMUM_YEARS_OF_EMPLOYMENT = 2;
export const MAXIMUM_YEARS_OF_EMPLOYMENT = 20;
export const MINIMUM_YEARS_OF_EMPLOYMENT_NI = 2;
export const MAXIMUM_YEARS_OF_EMPLOYMENT_NI = 20;

// after 1st April 20205
export const MAXIMUM_STATUTORY_REDUNDANCY_PAY = 21570;
export const MAXIMUM_STATUTORY_REDUNDANCY_PAY_NI = 22470;

// before 1st April 2025
export const MAXIMUM_STATUTORY_REDUNDANCY_PAY_PRE_APRIL_2025 = 21000;
export const MAXIMUM_STATUTORY_REDUNDANCY_PAY_NI_PRE_APRIL_2025 = 21870;

export const WEEKS_IN_YEAR = 52.0;
export const MONTHS_IN_YEAR = 12.0;

export const PERSONAL_ALLOWANCE = 12570;
export const PERSONAL_ALLOWANCE_CAP = 100000;
export const PERSONAL_ALLOWANCE_REDUCTION_RATIO = 2;

export const TAX_BANDS = [
  { rate: 0.2, range: { min: 0, max: 37700 } },
  { rate: 0.4, range: { min: 37701, max: 125140 } },
  { rate: 0.45, range: { min: 125141, max: Number.MAX_VALUE } },
];

export const TAX_BANDS_SCOTLAND = [
  { rate: 0.19, range: { min: 0, max: 2306 } },
  { rate: 0.2, range: { min: 2307, max: 13991 } },
  { rate: 0.21, range: { min: 13992, max: 31092 } },
  { rate: 0.42, range: { min: 31093, max: 62430 } },
  { rate: 0.45, range: { min: 62431, max: 125140 } },
  { rate: 0.47, range: { min: 125141, max: Number.MAX_VALUE } },
];
