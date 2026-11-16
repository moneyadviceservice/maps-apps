export const QUESTION_PREFIX = 'q-';

export enum Q5PensionTypeAnswer {
  DEFINED_CONTRIBUTION = '0',
  DEFINED_BENEFIT = '1',
  STATE_PENSION = '2',
  OTHER = '3',
  NOT_SURE = '4',
}

export enum Q1PrimaryGoalAnswer {
  HOW_PENSION_WORKS = '0',
  HOW_MUCH_MONEY = '1',
  HOW_TO_GROW_PENSION = '2',
  TRANSFER_OR_COMBINE_PENSION = '3',
  WHEN_AND_HOW_TO_TAKE_PENSION = '4',
  LET_US_GUIDE = '5',
}

export enum Q2RetirementTimingAnswer {
  WITHIN_10_YEARS = '0',
  MORE_THAN_10_YEARS = '1',
  ALREADY_RETIRED = '2',
}

export enum Q3EmploymentAnswer {
  EMPLOYED = '0',
  SELF_EMPLOYED = '1',
  NOT_EMPLOYED = '2',
}

export enum Q4PensionContributionAnswer {
  YES = '0',
  NO = '1',
  NOT_SURE = '2',
}

export enum Q6ConsolidationAnswer {
  YES = '0',
  NO = '1',
  NOT_SURE = '2',
}

export enum Q7OverseasRetirementAnswer {
  YES = '0',
  NO = '1',
  NOT_SURE = '2',
}

export enum Q8DivorceAnswer {
  YES = '0',
  NO = '1',
}

export enum Q9HousingCostAnswer {
  PRIVATE_RENTAL = '0',
  SOCIAL_HOUSING = '1',
  MORTGAGE = '2',
  NONE = '3',
}

export enum Q11DebtAnswer {
  YES = '0',
  NO = '1',
}

export const PAGE_PATH_PREFIX = '/question-';
export const CHECK_ANSWERS_PAGE = '/change-options';
export const CHANGE_ANSWER_PARAM = 'changeAnswer';
export const TOOL_NAME = 'Get Retirement Guidance';
export const PAGE_NAME_PREFIX = 'get-retirement-guidance--';
export const PAGE_TITLE_PREFIX = 'Get Retirement Guidance -- ';
export const BETA_FEEDBACK_LINKS = {
  en: 'https://forms.cloud.microsoft/e/0EN22TpdFp',
  cy: 'https://forms.cloud.microsoft/e/dGa9PCZw63',
} as const;
