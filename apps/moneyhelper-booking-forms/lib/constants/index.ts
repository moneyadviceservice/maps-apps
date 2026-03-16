export enum FlowName {
  BASE = 'base',

  /*** Main Flows ***/
  PENSION_WISE = 'pension-wise',
  DIVORCE_SEPARATION = 'divorce-separation',
  SELF_EMPLOYED = 'self-employed',
  PENSION_LOSS = 'pension-loss',

  /*** ELIGIBILITY Flow Variations
   * LEGEND:
   * DC = Defined Contribution
   * FS = Financial Settlement
   * PW = Pension Wise
   * PL = Pension Loss
   * ****/
  ELIGIBILITY_DC_PASS = 'eligibility-dc-pass',
  ELIGIBILITY_OVER_50_PASS = 'eligibility-over-50-pass',
  ELIGIBILITY_OVER_50_FAIL = 'eligibility-over-50-fail',
  ELIGIBILITY_AGE_EXC_PASS = 'eligibility-age-exc-pass',
  ELIGIBILITY_FS_PASS = 'eligibility-fs-pass',
  ELIGIBILITY_FS_FAIL = 'eligibility-fs-fail',
  ELIGIBILITY_PW_FAIL = 'eligibility-pw-fail',
  ELIGIBILITY_PL_PASS = 'eligibility-pl-pass',
  ELIGIBILITY_PL_FAIL = 'eligibility-pl-fail',
}

export enum StepName {
  APPOINTMENT_TYPE = 'appointment-type',
  LOADING = 'loading',
  ERROR = 'error',

  /** PENSION WISE ****/
  PENSION_WISE_APPOINTMENT = 'pension-wise-appointment',
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
  ELIGIBILITY_UNDER_50 = 'eligibility-under-50',
  ELIGIBILITY_UK_PENSIONS = 'eligibility-uk-pensions',
  ELIGIBILITY_AGE_EXCEPTIONS = 'eligibility-age-exceptions',
  ELIGIBILITY_FINANCIAL_SETTLEMENT = 'eligibility-financial-settlement',
  ELIGIBILITY_BUSINESS_STATE = 'eligibility-business-state',
  ELIGIBILITY_PENSION_LOSS = 'eligibility-pension-loss',
}

export enum Guards {
  COOKIE_GUARD = 'cookieGuard',
  VALIDATE_STEP_GUARD = 'validateStepGuard',
}

export enum SidebarType {
  HELP = 'help',
  INFORMATION = 'information',
}
