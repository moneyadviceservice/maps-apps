export const QUESTION_PREFIX = 'q-';
export enum PensionTypeQuestion {
  SET_UP_BY_EMPLOYER = '1',
  PUBLIC_SECTOR_EMPLOYER = '2',
  PROVIDER_LISTED = '3',
  PENSION_START_DATE = '4',
}

export enum SetUpByEmployerAnswer {
  YES = '0',
  NO = '1',
  NOT_SURE = '2',
}

export enum PublicSectorEmployerAnswer {
  YES = '0',
  NO = '1',
  NOT_SURE = '2',
}

export enum ProviderListedAnswer {
  YES = '0',
  NO = '1',
  NOT_SURE = '2',
}

export enum PensionStartDateAnswer {
  BEFORE_2000 = '0',
  FROM_2000 = '1',
  DONT_KNOW = '2',
}
export const SCORE_PREFIX = 'score-q-';
export const CHANGE_ANSWER_PARAM = 'changeAnswer';
export const SUBMIT_ANSWER_API = '/api/form-actions/submit-answer';
export const CHANGE_ANSWER_API = '/api/form-actions/change-answer';
export const PENSION_CALCULATOR_API = '/api/pensions-calculator';
