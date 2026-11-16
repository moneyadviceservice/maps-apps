/** Enums **/
export enum FlowName {
  BASE = 'base',
}

export const FLOW_VERSION = 'v1';

// App-level route prefix passed to shared form routing helpers; move into a combined formConfig if more shared settings emerge.
export const FORM_BASE_PATH = 'taking-part';

export enum StepName {
  DATA_AND_PRIVACY = 'data-and-privacy',
  AGREEMENT_AND_CONSENT = 'agreement-and-consent',
  ABOUT_YOU = 'about-you',
  DECLINE = 'decline',
  WHERE_YOU_LIVE = 'where-you-live',
  YOUR_SEX = 'your-sex',
  HEALTH_CONDITIONS = 'health-conditions',
  HEALTH_CONDITIONS_IMPACT = 'health-conditions-impact',
  SUBMIT = 'submit',
  LOADING = 'loading',
  SUBMIT_DATA = 'submit-data',
  ERROR = 'error',
  SIGN_UP_UPDATE = 'sign-up-update',
}

export enum Guards {
  COOKIE_GUARD = 'cookieGuard',
  VALIDATE_STEP_GUARD = 'validateStepGuard',
}

export enum SubmissionState {
  IDLE = 'idle',
  IN_PROGRESS = 'in_progress',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export enum ResponseMessage {
  GENERIC_ERROR = '103',
  SUBMISSION_FAILED = '104',
  FORM_HANDLER_ERROR = '105',
}

export enum FormFieldName {
  TERMS_AND_CONDITIONS = 'termsAndConditions',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL_ADDRESS = 'emailAddress',
  AGE_RANGE = 'ageRange',
  HEALTH_CONDITIONS = 'healthConditions',
  HEALTH_CONDITIONS_IMPACT = 'healthConditionsImpact',
  WHERE_YOU_LIVE = 'whereYouLive',
  YOUR_SEX = 'yourSex',
  OTHER_SEX = 'otherSex',
}

/** Constants **/
export const FORM_FIELD_CONTENT_KEY: Record<FormFieldName, string> = {
  [FormFieldName.AGE_RANGE]: 'age-range',
  [FormFieldName.TERMS_AND_CONDITIONS]: 'terms-and-conditions',
  [FormFieldName.FIRST_NAME]: 'first-name',
  [FormFieldName.LAST_NAME]: 'last-name',
  [FormFieldName.EMAIL_ADDRESS]: 'email-address',
  [FormFieldName.WHERE_YOU_LIVE]: 'where-you-live',
  [FormFieldName.YOUR_SEX]: 'your-sex',
  [FormFieldName.HEALTH_CONDITIONS]: 'health-conditions',
  [FormFieldName.HEALTH_CONDITIONS_IMPACT]: 'health-conditions-impact',
  [FormFieldName.OTHER_SEX]: 'other-sex',
};
