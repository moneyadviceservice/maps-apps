export enum FlowName {
  BASE = 'base',

  /*** Main Flows ***/
  PENSION_WISE = 'pension-wise',
  DIVORCE_SEPARATION = 'divorce-separation',
  SELF_EMPLOYED = 'self-employed',
  PENSION_LOSS = 'pension-loss',
}

export enum StepName {
  APPOINTMENT_TYPE = 'appointment-type',
  LOADING = 'loading',
  ERROR = 'error',

  /** PENSION WISE ****/
  PENSION_WISE_APPOINTMENT = 'pension-wise-appointment',
  PENSION_WISE_PRE_APPOINTMENT = 'pension-wise-pre-appointment',
  PENSION_WISE_NOT_ELIGIBLE = 'pension-wise-not-eligible',

  /*** SELF EMPLOYED ****/
  SELF_EMPLOYED_APPOINTMENT = 'self-employed-appointment',
  SELF_EMPLOYED_PRE_APPOINTMENT = 'self-employed-pre-appointment',

  /*** DIVORCE APPOINTMENT ****/
  DIVORCE_APPOINTMENT = 'divorce-appointment',
  DIVORCE_PRE_APPOINTMENT = 'divorce-pre-appointment',
  DIVORCE_NOT_ELIGIBLE = 'divorce-not-eligible',

  /*** PENSION LOSS APPOINTMENT ****/
  PENSION_LOSS_APPOINTMENT = 'pension-loss-appointment',
  PENSION_LOSS_PRE_APPOINTMENT = 'pension-loss-pre-appointment',
  PENSION_LOSS_NOT_ELIGIBLE = 'pension-loss-not-eligible',

  /*** ELIGIBILITY ****/
  ELIGIBILITY_DEFINED_CONTRIBUTION = 'eligibility-defined-contribution',
  ELIGIBILITY_OVER_50 = 'eligibility-over-50',
  ELIGIBILITY_UK_PENSIONS = 'eligibility-uk-pensions',
  ELIGIBILITY_AGE_EXCEPTIONS = 'eligibility-age-exceptions',
  ELIGIBILITY_BUSINESS_STATE = 'eligibility-business-state',
  ELIGIBILITY_FINANCIAL_SETTLEMENT = 'eligibility-financial-settlement',
  ELIGIBILITY_PENSION_LOSS = 'eligibility-pension-loss',

  /*** ACCESS NEEDS ****/
  ACCESS_SUPPORT = 'access-support',
  ACCESS_LANGUAGE = 'access-language',
  ACCESS_OPTIONS = 'access-options',
  ACCESS_BSL = 'access-bsl',
  ACCESS_COMPANION = 'access-companion',
  ACCESS_REVIEW = 'access-review',
}

export const PRE_APPOINTMENT_STEP_BY_FLOW: Partial<Record<FlowName, StepName>> =
  {
    [FlowName.PENSION_WISE]: StepName.PENSION_WISE_PRE_APPOINTMENT,
    [FlowName.SELF_EMPLOYED]: StepName.SELF_EMPLOYED_PRE_APPOINTMENT,
    [FlowName.DIVORCE_SEPARATION]: StepName.DIVORCE_PRE_APPOINTMENT,
    [FlowName.PENSION_LOSS]: StepName.PENSION_LOSS_PRE_APPOINTMENT,
  };

export const FLOW_PRE_APPOINTMENT_TOKEN = 'flow-pre-appointment';

export enum Guards {
  COOKIE_GUARD = 'cookieGuard',
  VALIDATE_STEP_GUARD = 'validateStepGuard',
}

export enum SidebarType {
  HELP = 'help',
  INFORMATION = 'information',
}
