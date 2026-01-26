export enum FlowName {
  BASE = 'base',

  /**** Main Flows ****/
  PENSION_WISE = 'pension-wise',
  DIVORCE_SEPARATION = 'divorce-separation',
  SELF_EMPLOYED = 'self-employed',
  PENSION_LOSS = 'pension-loss',

  /*** ELIGIBILITY Flow Variations ****/
  ELIGIBILITY_DC_PASS = 'eligibility-dc-pass',
  ELIGIBILITY_OVER_50_PASS = 'eligibility-over-50-pass',
  ELIGIBILITY_OVER_50_FAIL = 'eligibility-over-50-fail',
  ELIGIBILITY_AGE_EXC_PASS = 'eligibility-age-exc-pass',
  ELIGIBILITY_PENSION_WISE_FAIL = 'eligibility-pension-wise-fail',
}

export enum StepName {
  APPOINTMENT_TYPE = 'appointment-type',
  LOADING = 'loading',
  ERROR = 'error',
  PENSION_WISE_APPOINTMENT = 'pension-wise-appointment',
  ELIGIBILITY_DEFINED_CONTRIBUTION = 'eligibility-defined-contribution',
  ELIGIBILITY_OVER_50 = 'eligibility-over-50',
  ELIGIBILITY_UNDER_50 = 'eligibility-under-50',
  ELIGIBILITY_UK_PENSIONS = 'eligibility-uk-pensions',
  ELIGIBILITY_AGE_EXCEPTIONS = 'eligibility-age-exceptions',
  PENSION_WISE_NOT_ELIGIBLE = 'pension-wise-not-eligible',
}

export enum Guards {
  COOKIE_GUARD = 'cookieGuard',
  VALIDATE_STEP_GUARD = 'validateStepGuard',
}

export enum SidebarType {
  HELP = 'help',
  INFORMATION = 'information',
}
